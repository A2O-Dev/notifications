import { Field, Int, ObjectType } from '@nestjs/graphql'

export function Paginated<T>(classRef: T): any {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType {
    @Field(() => [classRef])
    items: T[]

    @Field(() => Int)
    total: number
  }

  return PaginatedType
}
