import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Attachment, Envelope, MessageChannel, MessageType } from '../dto'

export enum QueueMessageStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  PROCESSING = 'PROCESSING',
  FAILED = 'FAILED',
}

@Entity('queue_messages')
export class QueueMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    enum: MessageChannel,
  })
  channel: MessageChannel

  @Column('enum', {
    enum: MessageType,
  })
  type: MessageType

  @Column('json')
  envelope: Envelope

  @Column('json', { nullable: true })
  payload?: any

  @Column('jsonb', { nullable: true })
  attachments?: Attachment[]

  @Column('enum', {
    enum: QueueMessageStatus,
    default: QueueMessageStatus.PENDING,
  })
  status?: QueueMessageStatus

  @Column('int', { default: 0 })
  retry_count: number

  @Column('json', { nullable: true })
  details?: any

  @CreateDateColumn()
  created_at?: Date

  @UpdateDateColumn()
  updated_at?: Date

  @DeleteDateColumn()
  deleted_at?: Date
}
