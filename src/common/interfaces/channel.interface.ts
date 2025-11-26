import { QueueMessage } from 'src/message/entities'

export interface ChannelInterface {
  send(queueMessage: QueueMessage): Promise<any>
}
