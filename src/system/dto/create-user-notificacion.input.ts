import { Field, ID, InputType } from '@nestjs/graphql'
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator'
import { GraphQLJSONObject } from 'graphql-type-json'

import { Attachment, MessageType } from 'src/message/dto'

@InputType()
export class CreateUserNotificationInput {
  @Field(() => ID)
  @IsUUID()
  user_id: string

  @Field(() => MessageType)
  @IsEnum(MessageType)
  type: MessageType

  @Field(() => String)
  subject: string

  @Field(() => String)
  @IsString()
  message: string

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  payload?: any

  @Field(() => [Attachment], { nullable: true })
  @IsOptional()
  attachments?: Attachment[]
}
