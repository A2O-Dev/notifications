import { forwardRef, Module } from '@nestjs/common'
import { WhatsappService } from './whatsapp.service'
import { HttpModule, HttpService } from '@nestjs/axios'
import { MessageModule } from 'src/message/message.module'
import { CommonModule } from 'src/common/common.module'

@Module({
  imports: [
    CommonModule,
    forwardRef(() => MessageModule),
    HttpModule.registerAsync({
      imports: [CommonModule],
      inject: [],
      useFactory: async () => ({
        baseURL: process.env.WHATSAPP_API_URL,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        },
      }),
    }),
  ],
  providers: [
    {
      provide: 'WHATSAPP_HTTP_SERVICE',
      useExisting: HttpService,
    },
    WhatsappService,
  ],
  exports: ['WHATSAPP_HTTP_SERVICE', WhatsappService],
})
export class WhatsappModule {}
