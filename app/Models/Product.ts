import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column, computed } from '@ioc:Adonis/Lucid/Orm'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public brand: string

  @column()
  public price: number

  @computed()
  public get priceCurrency() {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(this.price)
  }

  @column()
  public note: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public fullName: string

  @beforeSave()
  public static async createFullName(product: Product) {
    const brandChanged = typeof product.$dirty.brand === 'string'
    if (brandChanged || product.$dirty.name) {
      product.fullName = (product.brand + ' ' + product.name).trim()
    }
  }
}
