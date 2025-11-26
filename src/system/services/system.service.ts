import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common'

import { MessageChannel } from 'src/message/dto'
import { ChannelInterface } from 'src/common/interfaces'
import {
  MessageTemplateService,
  QueueMessageService,
} from 'src/message/services'
import { QueueMessage } from 'src/message/entities'
import { BaseChannelService } from 'src/common/services'
import { UserNotificationService } from './user-notification.service'

@Injectable()
export class SystemService
  extends BaseChannelService
  implements ChannelInterface
{
  private readonly logger = new Logger(SystemService.name)

  constructor(
    private readonly userNotificationService: UserNotificationService,
    @Inject(forwardRef(() => MessageTemplateService))
    messageTemplateService: MessageTemplateService,
    @Inject(forwardRef(() => QueueMessageService))
    private readonly queueMessageService: QueueMessageService,
  ) {
    super(messageTemplateService)
  }

  async send(queueMessage: QueueMessage): Promise<any> {
    this.logger.log(`[Logbook] Sending system notification...`, {
      queueMessage,
    })

    const systemSubject = await this.getSubject(
      MessageChannel.SYSTEM,
      queueMessage.envelope,
      queueMessage.type,
      queueMessage.payload,
    )

    const userIds = queueMessage.envelope.to
    for (const userId of userIds) {
      await this.userNotificationService.create({
        message: await this.getMessage(
          MessageChannel.SYSTEM,
          queueMessage.type,
          queueMessage.payload,
        ),
        user_id: userId,
        type: queueMessage.type,
        subject: systemSubject,
        payload: queueMessage.payload,
        attachments: queueMessage.attachments,
      })
    }

    this.logger.log(`[Logbook] System notification sent successfully.`)
  }
}
