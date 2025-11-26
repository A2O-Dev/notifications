import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ScheduleModule } from '@nestjs/schedule'
import { MailerModule } from '@nestjs-modules/mailer'
import _ = require('lodash')

import { database } from './config'
import { LoggerModule } from './logger/logger.module'
import { MessageModule } from './message/message.module'
import { KafkaModule } from './kafka/kafka.module'
import { EmailModule } from './email/email.module'
import { SystemModule } from './system/system.module'
import { HealthModule } from './health/health.module'
import { WhatsappModule } from './whatsapp/whatsapp.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [database],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...(await configService.get('database')),
        autoLoadEntities: true,
      }),
    }),
    ScheduleModule.forRoot(),
    MailerModule.forRootAsync({
      useFactory: async () => {
        const transport: any = {
          host: process.env.MAIL_HOST,
          port: +process.env.MAIL_PORT,
          secure: process.env.MAIL_SECURE,
        }

        const mailUser = process.env.MAIL_USERNAME
        if (mailUser && !_.isEmpty(mailUser) && !_.isNull(mailUser)) {
          transport.auth = {
            user: mailUser,
          }
        }

        const mailPassword = process.env.MAIL_PASSWORD
        if (
          mailPassword &&
          !_.isEmpty(mailPassword) &&
          !_.isNull(mailPassword)
        ) {
          transport.auth = {
            ...transport.auth,
            pass: mailPassword,
          }
        }

        return {
          transport,
        }
      },
    }),
    KafkaModule,
    LoggerModule,
    MessageModule,
    EmailModule,
    SystemModule,
    HealthModule,
    WhatsappModule,
  ],
})
export class AppModule {}
