import { Injectable, NotFoundException } from '@nestjs/common'
import _ from 'lodash'
import {
  Brackets,
  DeepPartial,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
} from 'typeorm'

export type OrderColumn = {
  col: string
  dir: 'ASC' | 'DESC'
  nulls?: 'NULLS FIRST' | 'NULLS LAST'
}

export type MandatoryOrderColumns = {
  columns: OrderColumn[]
  onlyThisColumns?: boolean
}

@Injectable()
export abstract class BaseService<T extends { id: any }> {
  protected readonly repository: Repository<T>

  constructor(repository: Repository<T>) {
    this.repository = repository
  }

  async getInitQuery(): Promise<SelectQueryBuilder<T>> {
    const entityName = this.repository.metadata.name.toLowerCase()
    const queryBuilder = this.repository.createQueryBuilder(entityName)
    return await this.loadRelations(entityName, queryBuilder)
  }

  async loadRelations(entityName: string, queryBuilder: SelectQueryBuilder<T>) {
    const relations = this.repository.metadata.eagerRelations ?? []

    for (const relation of relations) {
      queryBuilder.leftJoinAndSelect(
        `${entityName}.${relation.propertyPath}`,
        relation.propertyPath,
      )
    }

    return queryBuilder
  }

  protected getMandatoryOrderColumns(): MandatoryOrderColumns | null {
    return null
  }

  async findAll(
    limit: number,
    offset: number,
    query: any,
    isAllCheckSelected?: boolean,
    selectedIds: any = [],
    unselectedIds: any = [],
    orderBy?: OrderColumn[],
  ): Promise<{ items: T[]; total: number }> {
    const defaultOrderBy: OrderColumn[] = [
      { col: 'created_at', dir: 'DESC', nulls: 'NULLS LAST' },
    ]
    const finalOrderBy = !_.isEmpty(orderBy) ? orderBy : defaultOrderBy

    const queryBuilder = await this.getInitQuery()

    if (limit) {
      queryBuilder.take(limit)
    }

    if (offset) {
      queryBuilder.skip(offset)
    }

    this.findAllQuery(queryBuilder, query)

    if (typeof isAllCheckSelected !== 'undefined') {
      if (isAllCheckSelected) {
        if (unselectedIds.length > 0) {
          queryBuilder.andWhere(`${queryBuilder.alias}.id NOT IN (:...ids)`, {
            ids: unselectedIds,
          })
        }
      } else if (selectedIds.length > 0) {
        queryBuilder.andWhere(`${queryBuilder.alias}.id IN (:...ids)`, {
          ids: selectedIds,
        })
      }
    }

    this.applyOrdering(queryBuilder, finalOrderBy)

    return {
      items: await queryBuilder.getMany(),
      total: await queryBuilder.getCount(),
    }
  }

  protected resolveOrderColumnPath(
    qb: SelectQueryBuilder<T>,
    colPath: string,
  ): string {
    if (!colPath.includes('.')) {
      return `${qb.alias}.${colPath}`
    }

    const segments = colPath.split('.')
    let alias = qb.alias

    for (let i = 0; i < segments.length - 1; i++) {
      const relation = segments[i]
      const newAlias = segments.slice(0, i + 1).join('_')

      const alreadyJoined = qb.expressionMap.joinAttributes.some(
        (join) => join.alias.name === newAlias,
      )
      if (!alreadyJoined) {
        qb.leftJoin(`${alias}.${relation}`, newAlias)
      }

      alias = newAlias
    }

    const finalColumn = segments[segments.length - 1]
    return `${alias}.${finalColumn}`
  }

  async findAllQuery(
    queryBuilder: SelectQueryBuilder<T>,
    query: any,
  ): Promise<SelectQueryBuilder<T>> {
    const queryToReturn = queryBuilder
    if (query) {
      return queryToReturn
    } else {
      return queryBuilder
    }
  }

  async findOne(id: any): Promise<T> {
    const item = await this.repository.findOne({
      where: { id },
    })
    if (!item) {
      throw new NotFoundException('Recurso no encontrado.')
    }
    return item
  }

  async create(entity: DeepPartial<T>): Promise<T> {
    const newEntity = this.repository.create(entity)
    return await this.repository.save(newEntity)
  }

  async update(id: any, entity: DeepPartial<T>): Promise<T> {
    const updatedEntity = await this.repository.preload({ id, ...entity })
    await this.repository.save(updatedEntity)
    return await this.findOne(id)
  }

  async delete(id: any): Promise<boolean> {
    await this.findOne(id)
    const result = await this.repository.softDelete(id)

    if (result.affected === 0) {
      throw new NotFoundException('Reosurce not found')
    }

    return true
  }
  async findOneBy(conditions: FindOptionsWhere<T>): Promise<T> {
    const item = await this.repository.findOne({
      where: conditions,
    })

    if (!item) {
      const missingFields = Object.entries(conditions)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ')
      throw new NotFoundException(`Recurso no encontrado para ${missingFields}`)
    }

    return item
  }

  protected applyMultiColumnILikeFilter<T>(
    qb: SelectQueryBuilder<T>,
    columns: { column: string; param: string }[],
    searchTerm: string | undefined,
  ): void {
    if (!searchTerm || columns.length === 0) return

    qb.andWhere(
      new Brackets((qbInner) => {
        columns.forEach(({ column, param }, index) => {
          const condition = `CAST (${column} AS TEXT) ILIKE :${param}`
          const paramObj = { [param]: `%${searchTerm}%` }

          if (index === 0) {
            qbInner.where(condition, paramObj)
          } else {
            qbInner.orWhere(condition, paramObj)
          }
        })
      }),
    )
  }

  protected applyFilters<T>(qb: SelectQueryBuilder<T>, filters: any): void {
    filters.forEach((filter) => {
      if (filter.type === 'multi_column_string') {
        this.applyMultiColumnILikeFilter(qb, filter.columns, filter.searchTerm)
      }
    })
  }

  private applyOrdering(
    queryBuilder: SelectQueryBuilder<T>,
    orderBy: OrderColumn[],
  ) {
    const mandatory = this.getMandatoryOrderColumns()

    let finalOrderBy: OrderColumn[] = []

    if (mandatory) {
      if (mandatory.onlyThisColumns) {
        finalOrderBy = [...mandatory.columns]
      } else {
        finalOrderBy = [...orderBy]

        for (const mandatoryColumn of mandatory.columns) {
          const exists = finalOrderBy.some(
            (item) => item.col === mandatoryColumn.col,
          )
          if (!exists) finalOrderBy.push(mandatoryColumn)
        }
      }
    } else {
      finalOrderBy = [...orderBy]
    }

    if (_.isEmpty(finalOrderBy)) return

    for (const order of finalOrderBy) {
      const fullPath = this.resolveOrderColumnPath(queryBuilder, order.col)
      queryBuilder.addOrderBy(
        fullPath,
        _.get(order, 'dir', 'ASC'),
        _.get(order, 'nulls', 'NULLS LAST'),
      )
    }
  }
}
