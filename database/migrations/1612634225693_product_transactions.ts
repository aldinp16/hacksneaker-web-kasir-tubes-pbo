import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ProductTransactions extends BaseSchema {
  protected tableName = 'product_transaction'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('transaction_id').references('id').inTable('transactions').onDelete('CASCADE')
      table.integer('product_id').references('id').inTable('products').onDelete('CASCADE')
      table.double('price')
      table.integer('quantity')
      table.decimal('discount').defaultTo(0)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
