import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'
import JSON from 'graphql-type-json'

import { Attachment, MessageType } from 'src/message/dto'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@ObjectType()
@Entity('user_notifications')
export class UserNotification {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field(() => String)
  @Column('uuid')
  user_id: string

  @Field(() => MessageType)
  @Column('enum', { enum: MessageType })
  type: MessageType

  @Field(() => String, { nullable: true })
  @Column('text', { nullable: true })
  subject: string

  @Field(() => String)
  @Column('text')
  message: string

  @Field(() => Boolean)
  @Column('boolean', { default: false })
  is_readed: boolean

  @Field(() => JSON, { nullable: true })
  @Column('json', { nullable: true })
  payload?: any

  @Field(() => JSON, { nullable: true })
  @Column('jsonb', { nullable: true })
  attachments?: Attachment[]

  @Field(() => String)
  @CreateDateColumn()
  created_at?: Date

  @Field(() => String)
  @UpdateDateColumn()
  updated_at?: Date

  @Field(() => String, { nullable: true })
  @DeleteDateColumn()
  deleted_at?: Date
}

registerEnumType(MessageType, {
  name: 'MessageType',
})
