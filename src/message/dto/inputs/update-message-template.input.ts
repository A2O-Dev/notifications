import { Field, ID, InputType } from '@nestjs/graphql'
import { IsOptional, IsString, IsUUID } from 'class-validator'

@InputType()
export class UpdateMessageTemplateInput {
  @Field(() => ID)
  @IsUUID()
  id: string

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  subject?: any

  @Field(() => String)
  @IsString()
  content: string
}
