import { Injectable } from '@nestjs/common'
import dayjs from 'dayjs'
import _ = require('lodash')

import { Envelope, MessageChannel, MessageType } from 'src/message/dto'
import { MessageTemplate } from 'src/message/entities'
import { MessageTemplateService } from 'src/message/services'

@Injectable()
export abstract class BaseChannelService {
  constructor(
    private readonly messageTemplateService: MessageTemplateService,
  ) {}

  getMessageTemplate(
    channel: MessageChannel,
    type: MessageType,
  ): Promise<MessageTemplate> {
    return this.messageTemplateService.getByChannelAndType(channel, type)
  }

  async getMessage(
    channel: MessageChannel,
    type: MessageType,
    payload: any,
  ): Promise<string> {
    let message = ''
    if (type === MessageType.OTHER) {
      message = _.get(payload, 'content', '')
    } else {
      const messageTemplate = await this.getMessageTemplate(channel, type)
      if (!messageTemplate) {
        throw new Error(
          `Message template not defined for ${type} in ${channel} channel.`,
        )
      }
      message = _.get(messageTemplate, 'content', '')
    }

    message = this.replaceContentVars(message, payload, channel)

    return message
  }

  replaceContentVars(message: string, payload: any, channel: MessageChannel) {
    let messageToReturn = message
    const contentVars = this.getContentVars(messageToReturn)
    for (const contentVar of contentVars) {
      let value = _.get(payload, contentVar, '')
      if (contentVar.includes('_at') && !_.isEmpty(value)) {
        value = dayjs(value).format('DD/MM/YYYY')
      }

      if (typeof value === 'string' && channel === MessageChannel.WHATSAPP) {
        value = value.replace(/"/g, '')
      }
      messageToReturn = messageToReturn.replaceAll(`$$${contentVar}$$`, value)
    }

    return messageToReturn
  }

  getContentVars(content: string) {
    const regex = /\$\$(.*?)\$\$/g

    const matches = content.match(regex)
    const result = matches
      ? matches.map((match) => match.replace(/\$\$/g, ''))
      : []

    return result
  }

  async getSubject(
    channel: MessageChannel,
    envelope: Envelope,
    type: MessageType,
    payload: any,
  ) {
    let subject = 'GS1 Notification'

    const messageTemplate = await this.getMessageTemplate(channel, type)
    const messageTemplateSubject = _.get(messageTemplate, 'subject')
    if (
      !_.isNil(messageTemplateSubject) &&
      !_.isEmpty(messageTemplateSubject) &&
      !_.get(envelope, 'forceSubject', false)
    ) {
      subject = this.replaceContentVars(
        messageTemplate.subject,
        payload,
        channel,
      )
    } else if (envelope.subject) {
      subject = envelope.subject
    }

    return subject
  }
}
