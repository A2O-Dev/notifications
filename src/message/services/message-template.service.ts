import { Repository, SelectQueryBuilder } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { MessageChannel, MessageType } from '../dto'
import { MessageTemplate } from '../entities'
import { BaseService } from 'src/common/services'

@Injectable()
export class MessageTemplateService extends BaseService<MessageTemplate> {
  constructor(
    @InjectRepository(MessageTemplate)
    private readonly messageTemplateRepository: Repository<MessageTemplate>,
  ) {
    super(messageTemplateRepository)
  }

  async getByChannelAndType(
    channel: MessageChannel,
    type: MessageType,
  ): Promise<MessageTemplate> {
    return this.messageTemplateRepository.findOne({
      where: {
        channel,
        type,
      },
    })
  }

  async findAllQuery(
    queryBuilder: SelectQueryBuilder<MessageTemplate>,
    query: any,
  ): Promise<SelectQueryBuilder<MessageTemplate>> {
    this.applyFilters(queryBuilder, [
      {
        columns: [
          { column: 'type', param: 'searchKey' },
          {
            column: 'type',
            param: 'searchValue',
          },
        ],
        searchTerm: query.search,
        type: 'multi_column_string',
      },
    ])

    return queryBuilder
  }
}
