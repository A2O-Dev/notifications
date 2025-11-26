import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common'
import { HealthService } from './health.service'
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async checkHealth() {
    const result = await this.healthService.checkAll()

    if (result.status === 'ERROR') {
      throw new HttpException(result, HttpStatus.SERVICE_UNAVAILABLE)
    }

    return {
      statusCode: 200,
      ...result,
    }
  }
}
