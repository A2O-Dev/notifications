import { Controller, UseFilters } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'

import { KAFKA_TOPICS } from 'src/kafka/kafka-topics'
import { KafkaExceptionFilter } from 'src/kafka/kafka-exception.filter'
import { QueueMessageService } from '../services'
import { CreateQueueMessageDto } from '../dto'

@Controller()
export class QueueMessageController {
  constructor(private readonly queueMessageService: QueueMessageService) {}

  @UseFilters(new KafkaExceptionFilter())
  @EventPattern(KAFKA_TOPICS.SEND_MESSAGE)
  create(@Payload() createQueueMessageDto: CreateQueueMessageDto) {
    return this.queueMessageService.create(createQueueMessageDto)
  }
}
