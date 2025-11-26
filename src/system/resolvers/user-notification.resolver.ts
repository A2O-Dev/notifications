import {
  Args,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from '@nestjs/graphql'
import { ParseUUIDPipe } from '@nestjs/common'

import { Paginated } from 'src/common/entities'
import { UserNotificationService } from '../services'
import { PaginationInput } from 'src/common/dto/args'

import { UserNotification } from '../entities'
import { ActionBatchInput } from 'src/common/dto/inputs'

@ObjectType()
class UserNotificationPaginate extends Paginated(UserNotification) {}

@Resolver(() => UserNotification)
export class UserNotificationResolver {
  constructor(
    private readonly userNotificationService: UserNotificationService,
  ) {}

  @Query(() => UserNotificationPaginate, { name: 'userNotifications' })
  findAll(
    @Args() paginationInput: PaginationInput,
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
  ) {
    return this.userNotificationService.findAll(
      paginationInput.limit,
      paginationInput.offset,
      { user_id: id },
    )
  }

  @Query(() => UserNotification, { name: 'userNotification' })
  findOne(@Args('id', { type: () => String }, ParseUUIDPipe) id: string) {
    return this.userNotificationService.findOne(id)
  }

  @Query(() => Int, { name: 'unreadUserNotificationCount' })
  getUnreadCount(
    @Args('user_id', { type: () => String }, ParseUUIDPipe) user_id: string,
  ) {
    return this.userNotificationService.getUnreadCount(user_id)
  }

  @Mutation(() => Int, { name: 'markUserNotificationAsRead' })
  async markAsRead(
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
  ) {
    return this.userNotificationService.markAsRead(id)
  }

  @Mutation(() => Boolean, { name: 'removeUserNotification' })
  async deleteById(
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
  ) {
    return this.userNotificationService.delete(id)
  }

  @Mutation(() => Int, { name: 'deleteUserNotifications' })
  deleteUserNotifications(
    @Args('actionBatchInput') actionBatchInput: ActionBatchInput,
  ) {
    return this.userNotificationService.deleteInBatch(actionBatchInput)
  }
}
