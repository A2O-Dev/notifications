import { DataSourceOptions, DataSource } from 'typeorm'
import { config as dotenvConfig } from 'dotenv'
import { registerAs } from '@nestjs/config'
import { Logger } from '@nestjs/common'

dotenvConfig({ path: '.env' })
const logger = new Logger('Database')

export const databaseOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  schema: process.env.DB_SCHEMA,
  migrations: ['dist/migrations/*{.ts,.js}'],
  entities: ['dist/**/*.entity{.ts,.js}'],
  extra: {
    parseJson: true,
  },
}

export const database = registerAs('database', () => databaseOptions)
const appDataSource = new DataSource(databaseOptions)
export async function connectToDatabase() {
  try {
    await appDataSource.initialize()
    await appDataSource.query('SELECT 1')
    logger.log('Database connected successfully')
  } catch (err) {
    logger.error(
      'Failed to connect to the database. Exiting the process...',
      err,
    )
    process.exit(1)
  }
}
export default appDataSource
