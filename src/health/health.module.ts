import { Module } from '@nestjs/common'
import { HealthController } from './health.controller'
import { KafkaModule } from 'src/kafka/kafka.module'
import { HealthService } from './health.service'
import { CommonModule } from 'src/common/common.module'

@Module({
  imports: [KafkaModule, CommonModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
