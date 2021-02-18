import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Product from 'App/Models/Product'
import Transaction from 'App/Models/Transaction'
import User from 'App/Models/User'

export default class DashboardController {
  public async index({ view }: HttpContextContract) {
    const [[{ count: totalItem }], [{ count: totalTransaction }], [{ count: totalCashier }]]: Array<
      Array<{ count: number }>
    > = await Promise.all([
      Product.query().count('*'),
      Transaction.query().count('*'),
      User.query().where('level', '>', 0).count('*'),
    ])

    const top5itemPromise = Database.rawQuery(`WITH total AS (SELECT product_id, sum(quantity) as quantity FROM product_transaction GROUP BY product_id), products AS (SELECT id, full_name, price FROM products)
    SELECT id, full_name, quantity, price FROM total JOIN products ON products.id = total.product_id ORDER BY quantity DESC LIMIT 5;`)

    const lineChartDataSetPromise = Database.rawQuery(
      `SELECT to_char(created_at, 'Mon') as mon, extract(year from created_at) as yyyy, count(*) as total_transaction FROM transactions WHERE extract(year from created_at) = extract(year from CURRENT_DATE) GROUP BY mon, yyyy ORDER BY mon DESC`
    )
    const [top5item, lineChartDataSet] = await Promise.all([
      top5itemPromise,
      lineChartDataSetPromise,
    ])

    return view.render('pages/index', {
      widgetData: { totalItem, totalTransaction, totalCashier },
      top5item: top5item.rows,
      lineChartDataSet: {
        label: lineChartDataSet.rows.map((item) => item.mon),
        data: lineChartDataSet.rows.map((item) => item.total_transaction),
      },
    })
  }
}
