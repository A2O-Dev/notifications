import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserNotification } from './entities'
import { UserNotificationResolver } from './resolvers/'
import { SystemService, UserNotificationService } from './services'
import { MessageModule } from 'src/message/message.module'
import { CommonModule } from 'src/common/common.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserNotification]),
    forwardRef(() => MessageModule),
    CommonModule,
  ],
  providers: [UserNotificationResolver, UserNotificationService, SystemService],
  exports: [UserNotificationService, SystemService, TypeOrmModule],
})
export class SystemModule {}
