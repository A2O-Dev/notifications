import { TypeOrmModule } from '@nestjs/typeorm'
import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { EmailModule } from 'src/email/email.module'
import { QueueMessageService, MessageTemplateService } from './services'
import { QueueMessageController } from './controllers'
import { MessageTemplate, QueueMessage } from './entities'
import { SystemModule } from 'src/system/system.module'
import { WhatsappModule } from 'src/whatsapp/whatsapp.module'
import { CommonModule } from 'src/common/common.module'
import { MessageTemplateResolver } from './resolvers'

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([QueueMessage, MessageTemplate]),
    forwardRef(() => EmailModule),
    forwardRef(() => SystemModule),
    forwardRef(() => WhatsappModule),
    CommonModule,
  ],
  controllers: [QueueMessageController],
  providers: [
    QueueMessageService,
    MessageTemplateService,
    MessageTemplateResolver,
  ],
  exports: [TypeOrmModule, QueueMessageService, MessageTemplateService],
})
export class MessageModule {}
