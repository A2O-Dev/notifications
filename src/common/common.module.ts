import { Module } from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'

@Module({
  imports: [CacheModule.register()],
  providers: [],
  exports: [],
})
export class CommonModule {}
