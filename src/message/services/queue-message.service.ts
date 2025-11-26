import { In, LessThan, Repository } from 'typeorm'
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { SchedulerRegistry } from '@nestjs/schedule'
import { CronJob } from 'cron'

import { QueueMessage, QueueMessageStatus } from '../entities'
import { CreateQueueMessageDto, MessageChannel } from '../dto'
import { EmailService } from 'src/email/services'
import { ChannelInterface } from 'src/common/interfaces'
import { SystemService } from 'src/system/services'
import { WhatsappService } from 'src/whatsapp/whatsapp.service'
import { parseBoolean } from 'src/utils'

@Injectable()
export class QueueMessageService {
  private readonly logger = new Logger(QueueMessageService.name)

  constructor(
    @Inject(forwardRef(() => EmailService))
    private readonly emailService: EmailService,
    private readonly systemService: SystemService,
    private readonly whatsappService: WhatsappService,
    @InjectRepository(QueueMessage)
    private readonly queueMessageRepository: Repository<QueueMessage>,
    private readonly schedulerRegisry: SchedulerRegistry,
  ) {}

  async onModuleInit() {
    const executeQueueMessages = new CronJob(
      process.env.CRON_JOB_EXECUTE_QUEUE_MESSAGES,
      async () => await this.executeQueueMessages(),
    )

    this.schedulerRegisry.addCronJob(
      'executeQueueMessages',
      executeQueueMessages,
    )

    const isEnabled = parseBoolean(
      process.env.ENABLED_CRON_JOB_EXECUTE_QUEUE_MESSAGES,
    )
    if (isEnabled) {
      executeQueueMessages.start()
    }
  }

  async create(createQueueMessageDto: CreateQueueMessageDto) {
    const queueMessage = await this.queueMessageRepository.save(
      createQueueMessageDto,
    )
    await this.executeQueueMessage(queueMessage)
    return queueMessage
  }

  async executeQueueMessages() {
    this.logger.log('Executing queue messages...')
    const pendingQueueMessages = await this.getPendingQueueMessages()

    if (pendingQueueMessages.length === 0) {
      this.logger.log('No pending queue messages found.')
      return
    }

    this.logger.log(
      `Found ${pendingQueueMessages.length} pending queue messages.`,
    )

    for (const queueMessage of pendingQueueMessages) {
      await this.executeQueueMessage(queueMessage)
    }

    this.logger.log('Queue messages executed successfully.')
  }

  async executeQueueMessage(queueMessage: QueueMessage) {
    try {
      this.logger.log(`[${queueMessage.id}] Executing queue message...`)

      queueMessage.status = QueueMessageStatus.PROCESSING
      await this.queueMessageRepository.save(queueMessage)

      let response = null
      if (queueMessage.channel === MessageChannel.EMAIL) {
        response = await this.send(this.emailService, queueMessage)
      } else if (queueMessage.channel === MessageChannel.SYSTEM) {
        response = await this.send(this.systemService, queueMessage)
      } else if (queueMessage.channel === MessageChannel.WHATSAPP) {
        response = await this.send(this.whatsappService, queueMessage)
      } else {
        throw new Error('Channel not supported.')
      }

      queueMessage.status = QueueMessageStatus.SUCCESS
      queueMessage.details = { response }
      await this.queueMessageRepository.save(queueMessage)

      this.logger.log(
        `[${queueMessage.id}] Queue message executed successfully.`,
      )
    } catch (error) {
      queueMessage.status = QueueMessageStatus.FAILED
      queueMessage.retry_count = queueMessage.retry_count + 1
      queueMessage.details = {
        error: error?.message || error,
      }
      await this.queueMessageRepository.save(queueMessage)
      this.logger.error(error)
    }
  }

  async send(service: ChannelInterface, queueMessage: QueueMessage) {
    return service.send(queueMessage)
  }

  async getPendingQueueMessages(): Promise<QueueMessage[]> {
    return this.queueMessageRepository.find({
      where: {
        status: In([QueueMessageStatus.PENDING, QueueMessageStatus.FAILED]),
        retry_count: LessThan(parseInt(process.env.MAX_RETRIES_QUEUE_MESSAGES)),
      },
    })
  }
}
