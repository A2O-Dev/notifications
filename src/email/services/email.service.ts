import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common'
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'
import { SentMessageInfo } from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'

import { Envelope, MessageChannel, MessageType } from 'src/message/dto'
import { ChannelInterface } from 'src/common/interfaces'
import {
  MessageTemplateService,
  QueueMessageService,
} from 'src/message/services'
import { BaseChannelService } from '../../common/services/base-channel.service'
import { QueueMessage } from 'src/message/entities'

@Injectable()
export class EmailService
  extends BaseChannelService
  implements ChannelInterface
{
  private readonly logger = new Logger(EmailService.name)

  constructor(
    private readonly configService: ConfigService,
    private readonly mailService: MailerService,
    @Inject(forwardRef(() => MessageTemplateService))
    messageTemplateService: MessageTemplateService,
    private readonly queueMessageService: QueueMessageService,
  ) {
    super(messageTemplateService)
  }

  private async generateEnvelopeMailOptions(
    envelope: Envelope,
    type: MessageType,
    payload: any,
  ): Promise<ISendMailOptions> {
    const mailOptions: ISendMailOptions = {
      to: envelope.to.join(','),
    }

    mailOptions.from = `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_ADDRESS}>`

    if (envelope.cc && envelope.cc.length > 0) {
      mailOptions.cc = envelope.cc.join(',')
    }

    if (envelope.bcc && envelope.bcc.length > 0) {
      mailOptions.bcc = envelope.bcc.join(',')
    }

    if (envelope.reply_to) {
      mailOptions.replyTo = envelope.reply_to
    }

    const emailSubject = await this.getSubject(
      MessageChannel.EMAIL,
      envelope,
      type,
      payload,
    )

    mailOptions.subject = emailSubject

    return mailOptions
  }

  async send(queueMessage: QueueMessage): Promise<any> {
    this.logger.log(`[Logbook] Sending email...`, {
      queueMessage,
    })

    const envelopeMailOptions = await this.generateEnvelopeMailOptions(
      queueMessage.envelope,
      queueMessage.type,
      queueMessage.payload,
    )
    const sentMessageInfo: SentMessageInfo = await this.mailService.sendMail({
      ...envelopeMailOptions,
      html: await this.getMessage(
        MessageChannel.EMAIL,
        queueMessage.type,
        queueMessage.payload,
      ),
      attachments: queueMessage.attachments as Mail.Attachment[],
    })

    this.logger.log(`[Logbook] Email sent successfully.`, {
      sentMessageInfo,
    })
    return sentMessageInfo
  }
}
