import {
  ArgsType,
  Field,
  InputType,
  Int,
  registerEnumType,
} from '@nestjs/graphql'
import { Type } from 'class-transformer'
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator'

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(OrderDirection, {
  name: 'OrderDirection',
  description: 'Dirección para ordenar los resultados',
})

@InputType()
class OrderByInput {
  @Field()
  @IsString()
  col: string

  @Field(() => OrderDirection)
  @IsEnum(OrderDirection)
  dir: OrderDirection

  @Field({ nullable: true })
  @IsOptional()
  nulls?: 'NULLS FIRST' | 'NULLS LAST'
}

@ArgsType()
export class PaginationInput {
  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(0)
  @IsOptional()
  offset?: number

  @Field(() => [OrderByInput], { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OrderByInput)
  orderBy?: OrderByInput[]
}
