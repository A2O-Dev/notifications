import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Transform, Type } from 'class-transformer'
import { Field, ObjectType } from '@nestjs/graphql'

export enum MessageChannel {
  EMAIL = 'EMAIL',
  SYSTEM = 'SYSTEM',
  WHATSAPP = 'WHATSAPP',
}

export enum MessageType {
  QUOTATION = 'QUOTATION',
  OTHER = 'OTHER',
}

@ObjectType()
export class Attachment {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  filename: string

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  path: string
}

export class Envelope {
  @IsArray()
  @IsOptional()
  to: string[]

  @IsArray()
  @IsEmail(undefined, { each: true })
  @IsOptional()
  cc: string[]

  @IsArray()
  @IsEmail(undefined, { each: true })
  @IsOptional()
  bcc: string[]

  @IsEmail()
  @IsOptional()
  reply_to: string

  @IsString()
  @IsOptional()
  subject: string

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => (value === undefined ? false : value))
  forceSubject: boolean
}

export class CreateQueueMessageDto {
  @IsEnum(MessageChannel)
  channel: MessageChannel

  @IsEnum(MessageType)
  type: MessageType

  @ValidateNested()
  @Type(() => Envelope)
  envelope: Envelope

  @IsOptional()
  payload: any

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Attachment)
  @IsOptional()
  attachments: Attachment[]
}
