import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { EmailService } from './services'
import { MessageModule } from 'src/message/message.module'

@Module({
  imports: [ConfigModule, forwardRef(() => MessageModule)],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
