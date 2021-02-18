import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from 'App/Models/Product'

export default class ProductsController {
  public async index({ view }: HttpContextContract) {
    const products = await Product.all()
    return view.render('pages/products/index', { products })
  }

  public async create({ view }: HttpContextContract) {
    return view.render('pages/products/create')
  }

  public async show({ view, params }: HttpContextContract) {
    const { id } = params
    const product = await Product.findOrFail(id)
    return view.render('pages/products/show.edge', { product })
  }

  public async store({ request, response, session }: HttpContextContract) {
    const data = request.only(['name', 'brand', 'price', 'note'])
    data.price = data.price.replace(/\./g, '')
    const { id } = await Product.create(data)
    session.flash('success', 'Item berhasil ditambahkan!')
    response.redirect().toRoute('ProductsController.show', { id })
  }

  public async edit({ params, view }: HttpContextContract) {
    const { id } = params
    const product = await Product.findOrFail(id)
    return view.render('pages/products/edit', { product })
  }

  public async update({ params, request, response, session }: HttpContextContract) {
    const { id } = params
    const data = request.only(['name', 'brand', 'price', 'note'])
    data.price = data.price.replace(/\./g, '')
    const product = await Product.findOrFail(id)
    product.merge(data)
    await product.save()
    session.flash('success', 'Item berhasil diedit!')
    response.redirect().toRoute('ProductsController.show', { id })
  }

  public async destroy({ params, session, response }: HttpContextContract) {
    const { id } = params
    const product = await Product.findOrFail(id)
    await product.delete()
    session.flash('success', 'Item berhasil dihapus!')
    response.redirect().toRoute('ProductsController.index')
  }

  public async selectApi({ request }: HttpContextContract) {
    const { term } = request.get()
    const products = await Product.query().where('full_name', 'ilike', `%${term}%`)
    return products
  }
}
