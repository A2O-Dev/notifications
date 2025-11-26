import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'
import _ from 'lodash'
import { CronJob } from 'cron'
import { SchedulerRegistry } from '@nestjs/schedule'

import { UserNotification } from '../entities'
import { BaseService } from 'src/common/services/base.service'
import { ActionBatchInput } from 'src/common/dto/inputs'
import { parseBoolean } from 'src/utils'

@Injectable()
export class UserNotificationService extends BaseService<UserNotification> {
  private readonly logger = new Logger(UserNotificationService.name)

  constructor(
    private readonly schedulerRegisry: SchedulerRegistry,
    @InjectRepository(UserNotification)
    private readonly userNotificationsRepository: Repository<UserNotification>,
  ) {
    super(userNotificationsRepository)
  }

  async onModuleInit() {
    const reviewUserNotificationsToDelete = new CronJob(
      await process.env.CRON_JOB_EXECUTE_DELETE_NOTIFICATIONS,
      async () => await this.reviewUserNotificationsToDelete(),
    )

    this.schedulerRegisry.addCronJob(
      'reviewUserNotificationsToDelete',
      reviewUserNotificationsToDelete,
    )

    const isEnabled = parseBoolean(
      process.env.ENABLED_CRON_JOB_EXECUTE_DELETE_NOTIFICATIONS,
    )
    if (isEnabled) {
      reviewUserNotificationsToDelete.start()
    }
  }

  async reviewUserNotificationsToDelete() {
    const numberOfDays = parseInt(
      process.env.DAYS_NUMBER_TO_DELETE_NOTIFICATIONS,
    )
    const userNotificationsToDelete =
      await this.getUserNotificationsOlderThanXDays(numberOfDays)
    const userNotificationsIdsToDelete = userNotificationsToDelete.map(
      (userNotification) => _.get(userNotification, 'id'),
    )

    if (userNotificationsToDelete.length === 0) {
      this.logger.log(
        `No se encontro notificaciones de usuario mayores a ${numberOfDays} dias para eliminar`,
      )
      return
    }
    const updateResult = await this.userNotificationsRepository.softDelete(
      userNotificationsIdsToDelete,
    )
    this.logger.log(
      `Se eliminaron ${updateResult.affected} notificaciones de usuario`,
    )
  }

  async getUserNotificationsOlderThanXDays(
    numberOfDays: number,
  ): Promise<UserNotification[]> {
    const userNotifications = await this.userNotificationsRepository
      .createQueryBuilder('usernotification')
      .where('usernotification.created_at <= :date', {
        date: new Date(new Date().setDate(new Date().getDate() - numberOfDays)),
      })
      .getMany()

    return userNotifications
  }

  async findAllQuery(
    queryBuilder: SelectQueryBuilder<UserNotification>,
    query: any,
  ): Promise<SelectQueryBuilder<UserNotification>> {
    if (query?.user_id) {
      if (Array.isArray(query.user_id) && query.user_id.length > 0) {
        queryBuilder.andWhere('usernotification.user_id IN (:...user_id)', {
          user_id: query.user_id,
        })
      } else {
        queryBuilder.andWhere('usernotification.user_id = :user_id', {
          user_id: query.user_id,
        })
      }
    }
    queryBuilder.addOrderBy('usernotification.created_at', 'DESC')

    return queryBuilder
  }

  async getUnreadCount(user_id: string): Promise<number> {
    return await this.userNotificationsRepository.count({
      where: { user_id, is_readed: false, deleted_at: null },
    })
  }

  async markAsRead(id: string) {
    const updateResult = await this.userNotificationsRepository.update(
      { id },
      { is_readed: true },
    )
    return updateResult.affected ?? 0
  }

  async deleteInBatch(actionBatchInput: ActionBatchInput) {
    const { items: userNotifications } = await this.findAll(
      undefined,
      undefined,
      actionBatchInput.query ?? {},
      actionBatchInput.isAllCheckSelected,
      actionBatchInput.selectedIds,
      actionBatchInput.unselectedIds,
    )

    const userNotificationsIdsToDelete = userNotifications.map(
      (userNotification) => _.get(userNotification, 'id'),
    )

    if (userNotifications.length === 0) {
      throw new BadRequestException(
        `No se encontro notificaciones de usuario para eliminar`,
      )
    }
    const updateResult = await this.userNotificationsRepository.softDelete(
      userNotificationsIdsToDelete,
    )

    return updateResult.affected ?? 0
  }
}
