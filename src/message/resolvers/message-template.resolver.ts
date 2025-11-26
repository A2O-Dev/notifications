import { Resolver, Query, Args, ObjectType, Mutation } from '@nestjs/graphql'
import JSON from 'graphql-type-json'

import { Paginated } from 'src/common/entities'
import { MessageTemplateService } from '../services'
import { MessageTemplate } from '../entities/message-template.entity'
import { PaginationInput } from 'src/common/dto/args'
import { UpdateMessageTemplateInput } from '../dto/inputs'

@ObjectType()
class MessageTemplatePaginate extends Paginated(MessageTemplate) {}

@Resolver(() => MessageTemplate)
export class MessageTemplateResolver {
  constructor(
    private readonly messageTemplateService: MessageTemplateService,
  ) {}

  @Query(() => MessageTemplatePaginate, { name: 'messageTemplates' })
  findAll(
    @Args() paginationInput: PaginationInput,
    @Args('query', { type: () => JSON, nullable: true }) query: any,
  ) {
    return this.messageTemplateService.findAll(
      paginationInput.limit,
      paginationInput.offset,
      query,
      undefined,
      [],
      [],
      paginationInput.orderBy,
    )
  }

  @Mutation(() => MessageTemplate, { name: 'updateMessageTemplate' })
  updateMessageTemplate(
    @Args('updateMessageTemplateInput')
    updateMessageTemplateInput: UpdateMessageTemplateInput,
  ) {
    return this.messageTemplateService.update(
      updateMessageTemplateInput.id,
      updateMessageTemplateInput,
    )
  }
}
