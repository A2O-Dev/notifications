import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'
import database from 'src/config/database'
import { getKafkaConfig } from 'src/config/kafka'
import { KAFKA_TOPICS } from 'src/kafka/kafka-topics'

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name)

  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
  ) {}
  async checkKafka(): Promise<{ status: 'OK' | 'ERROR'; message?: string }> {
    const payload = { ping: true }

    try {
      await firstValueFrom(
        this.kafkaClient.emit(KAFKA_TOPICS.HEALTH_CHECK, payload),
      )
      return { status: 'OK' }
    } catch (error) {
      return {
        status: 'ERROR',
        message: `Emit failed: ${error.message}`,
      }
    }
  }

  async checkDatabase(): Promise<{ status: 'OK' | 'ERROR'; message?: string }> {
    try {
      await database.query('SELECT 1')
      return { status: 'OK' }
    } catch (error) {
      this.logger.error('Database health check failed', error)
      return { status: 'ERROR', message: 'Database connection failed' }
    }
  }
  async checkAll() {
    const dbResult = await this.checkDatabase()
    let kafkaResult: { status: 'OK' | 'ERROR'; message?: string } | undefined

    const { isEnabled: kafkaEnabled } = getKafkaConfig()
    if (kafkaEnabled) {
      kafkaResult = await this.checkKafka()
    }
    const status =
      dbResult.status === 'OK' &&
      (!kafkaEnabled || kafkaResult?.status === 'OK')
        ? 'OK'
        : 'ERROR'

    return {
      status,
      database: dbResult,
      ...(kafkaEnabled && { kafka: kafkaResult }),
    }
  }
}
