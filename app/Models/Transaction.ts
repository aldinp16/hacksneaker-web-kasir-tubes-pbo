import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Product from './Product'
import User from './User'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public customerName: string

  @column()
  public paymentMethod: string

  @column()
  public userId: number

  @column()
  public note: string

  @column()
  public discount: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @manyToMany(() => Product, {
    pivotColumns: ['quantity', 'discount', 'price'],
  })
  public items: ManyToMany<typeof Product>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
