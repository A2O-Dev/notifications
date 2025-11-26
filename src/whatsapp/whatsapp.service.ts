import { HttpService } from '@nestjs/axios'
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common'
import { AxiosError } from 'axios'
import { firstValueFrom } from 'rxjs'

import { ChannelInterface } from 'src/common/interfaces'
import { BaseChannelService } from 'src/common/services'
import { MessageChannel } from 'src/message/dto'
import { QueueMessage } from 'src/message/entities'
import {
  MessageTemplateService,
  QueueMessageService,
} from 'src/message/services'

@Injectable()
export class WhatsappService
  extends BaseChannelService
  implements ChannelInterface
{
  private readonly logger = new Logger(WhatsappService.name)
  private phoneNumberId: string
  private productName: string

  constructor(
    @Inject('WHATSAPP_HTTP_SERVICE') private readonly httpService: HttpService,
    @Inject(forwardRef(() => MessageTemplateService))
    messageTemplateService: MessageTemplateService,
    @Inject(forwardRef(() => QueueMessageService))
    private readonly queueMessageService: QueueMessageService,
  ) {
    super(messageTemplateService)
  }

  async onModuleInit() {
    await this.loadParameters()
  }

  private async loadParameters() {
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
    this.productName = process.env.WHATSAPP_PRODUCT_NAME

    if (!this.phoneNumberId) {
      throw new Error('Missing WHATSAPP_PHONE_NUMBER_ID')
    }
  }

  async send(queueMessage: QueueMessage): Promise<any> {
    this.logger.log(`[Logbook] Sending whatsapp messages...`, { queueMessage })

    const recipientPhoneNumbers = queueMessage.envelope.to
    const messageTemplates = JSON.parse(
      await this.getMessage(
        MessageChannel.WHATSAPP,
        queueMessage.type,
        queueMessage.payload,
      ),
    )

    const sendMessageResponses = []
    for (const phoneNumber of recipientPhoneNumbers) {
      const responsesPerNumber = []
      for (const messageTemplate of messageTemplates) {
        try {
          const sendMessageResponse = await this.sendMessageTemplate(
            phoneNumber,
            messageTemplate,
          )
          responsesPerNumber.push({
            template: messageTemplate.name,
            success: true,
            response: sendMessageResponse,
          })
        } catch (error) {
          this.logger.error(
            `[Logbook] Failed to send template '${messageTemplate.name}' to '${phoneNumber}': ${error.message || error}`,
          )
          responsesPerNumber.push({
            template: messageTemplate.name,
            success: false,
            error: error.message || error,
          })
        }
      }

      sendMessageResponses.push({
        to: phoneNumber,
        messages: responsesPerNumber,
      })
    }

    return sendMessageResponses
  }

  async sendMessageTemplate(to: string, template: any): Promise<any> {
    const url = `/${this.phoneNumberId}/messages`

    const payload = {
      messaging_product: this.productName,
      recipient_type: 'individual',
      to,
      type: 'template',
      template,
    }

    try {
      this.logger.log(
        `Sending POST request to Whatsapp API ${url} with payload: ${JSON.stringify(payload)}`,
      )
      const response = await firstValueFrom(this.httpService.post(url, payload))

      this.logger.log(
        `[Logbook] Response from Whatsapp API ${url}: ${JSON.stringify(response.data)}`,
      )
      return response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        const responseData = error.response?.data || error.message
        this.logger.error(`[Logbook] ${JSON.stringify(responseData)}`)
        throw new Error(responseData?.error?.message)
      } else {
        const errorMessage = 'Unexpected error occurred'
        this.logger.error(`[Logbook] ${errorMessage} ${JSON.stringify(error)}`)
        throw new Error(errorMessage)
      }
    }
  }
}
