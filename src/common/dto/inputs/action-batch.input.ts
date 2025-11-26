import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean, IsObject, IsOptional, IsString } from 'class-validator'
import JSON from 'graphql-type-json'

@InputType()
export class ActionBatchInput {
  @Field(() => JSON, { nullable: true })
  @IsObject()
  @IsOptional()
  query: any

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isAllCheckSelected: boolean

  @Field(() => [String], { nullable: true })
  @IsString({ each: true })
  @IsOptional()
  selectedIds: string[]

  @Field(() => [String], { nullable: true })
  @IsString({ each: true })
  @IsOptional()
  unselectedIds: string[]
}
