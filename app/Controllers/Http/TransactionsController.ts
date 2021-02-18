import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Product from 'App/Models/Product'
import Transaction from 'App/Models/Transaction'
import User from 'App/Models/User'
import { chain, zip } from 'lodash'

export default class TransactionsController {
  public async index({ view, auth }: HttpContextContract) {
    const transactionsQuery = Transaction.query()

    if (!auth.user?.isAdmin) {
      transactionsQuery.where('user_id', auth.user?.id as number)
    }

    const transactionsResultModel = await transactionsQuery.preload('items').preload('user')
    const transactions = transactionsResultModel.map((transaction) => {
      const id = transaction.id
      const cashier = transaction.user.fullName
      const customer = transaction.customerName
      const quantity = transaction.items
        .map((item) => item.$extras.pivot_quantity)
        .reduce((x, y) => x + y, 0)
      const time = transaction.createdAt
      const beforeDiscount = transaction.items
        .map((item) => {
          const discount = (+item.$extras.pivot_discount / 100) * item.$extras.pivot_price
          const price = (item.$extras.pivot_price - discount) * item.$extras.pivot_quantity
          return price
        })
        .reduce((x, y) => x + y, 0)
      const discount = (transaction.discount / 100) * beforeDiscount
      const total = beforeDiscount - discount
      return { id, cashier, customer, quantity, time, total }
    })

    return view.render('pages/transactions/index', { transactions })
  }

  public async create({ view }: HttpContextContract) {
    return view.render('pages/transactions/create')
  }

  public async show({ view, params, auth, response }: HttpContextContract) {
    const { id } = params

    const transaction = await Transaction.findOrFail(id)
    await Promise.all([transaction.preload('user'), transaction.preload('items')])

    const isAdmin = (auth.user?.level as number) > 0
    const notOwned = auth.user?.id !== transaction.user.id
    if (!isAdmin && notOwned) {
      return response.redirect('/notfound')
    }

    const items = transaction.items.map((item) => {
      const name = item.fullName
      const quantity = item.$extras.pivot_quantity
      const discount = item.$extras.pivot_discount
      const price = item.$extras.pivot_price
      const subtotal = (price - (discount / 100) * price) * quantity
      return { name, quantity, discount, price, subtotal }
    })

    const subtotal = items.map((item) => item.subtotal).reduce((x, y) => x + y, 0)
    const total = subtotal - (transaction.discount / 100) * subtotal
    const discount = (transaction.discount / 100) * subtotal
    return view.render('pages/transactions/show', { transaction, items, subtotal, total, discount })
  }

  public async store({ request, auth, response, session }: HttpContextContract) {
    const data = request.only(['customer_name', 'payment_method', 'discount_voucher', 'note'])

    const { item_id: itemId, quantity, discount } = request.only([
      'item_id',
      'quantity',
      'discount',
    ])

    const trx = await Database.transaction()

    const transaction = new Transaction()
    transaction.customerName = data.customer_name
    transaction.paymentMethod = data.payment_method
    transaction.discount = data.discount_voucher
    transaction.note = data.note
    transaction.useTransaction(trx)
    await transaction.save()
    await transaction.related('user').associate(auth.user as User)

    const products = await Product.query().useTransaction(trx).whereIn('id', itemId)
    const productKeyBy = chain(products)
      .map((product) => product.toJSON())
      .keyBy('id')
      .value()

    const itemsZip = zip(itemId, quantity, discount) as Array<[number, number, number]>

    const items = {}
    for (const [id, quantity, discount] of itemsZip) {
      items[id] = {
        quantity,
        price: productKeyBy[id].price,
        discount: discount || 0,
      }
    }

    await transaction.related('items').attach(items)
    await trx.commit()
    session.flash('success', 'Transaksi berhasil dibuat!')
    response.redirect().toRoute('TransactionsController.show', { id: transaction.id })
  }

  public async destroy({ params, session, response }: HttpContextContract) {
    const { id } = params
    const product = await Transaction.findOrFail(id)
    await product.delete()
    session.flash('success', 'Transaksi berhasil dihapus!')
    response.redirect().toRoute('TransactionsController.index')
  }
}
