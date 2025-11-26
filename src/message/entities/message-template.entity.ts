import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

import { MessageChannel, MessageType } from '../dto'
import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
@Entity('message_templates')
@Index(['channel', 'type'], { unique: true })
export class MessageTemplate {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field(() => String)
  @Column('enum', { enum: MessageChannel })
  channel: MessageChannel

  @Field(() => String)
  @Column('enum', { enum: MessageType })
  type: MessageType

  @Field(() => String)
  @Column('text', { nullable: true })
  subject?: string

  @Field(() => String)
  @Column('text', { nullable: true })
  content: string
}
