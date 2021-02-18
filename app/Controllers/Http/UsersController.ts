import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/User'

export default class UsersController {
  public async index({ view }: HttpContextContract) {
    const users = await User.query()
    return view.render('pages/users/index', { users })
  }

  public async create({ view }: HttpContextContract) {
    return view.render('pages/users/create')
  }

  public async show({ params, view }: HttpContextContract) {
    const { id } = params
    const user = await User.findOrFail(id)
    return view.render('pages/users/show', { user })
  }

  public async store({ request, session, response }: HttpContextContract) {
    const data = request.only(['fullName', 'level', 'email', 'password'])
    const { id } = await User.create(data)
    session.flash('success', 'User berhasil ditambahkan!')
    response.redirect().toRoute('UsersController.show', { id })
  }

  public async edit({ params, view }: HttpContextContract) {
    const { id } = params
    const user = await User.findOrFail(id)
    return view.render('pages/users/edit', { user })
  }

  public async update({ params, request, response, session }: HttpContextContract) {
    const { id } = params
    const data = request.only(['fullName', 'level', 'email', 'current_password', 'new_password'])
    console.log(data)
    const user = await User.findOrFail(id)

    const withPassword = data.current_password !== '' && data.new_password !== ''
    if (withPassword) {
      const verifyPassword = await Hash.verify(user.password, data.current_password)
      if (verifyPassword) {
        user.password = data.current_password
      } else {
        session.flash('success', 'Password Mismatch')
        return response.redirect().back()
      }
    }

    delete data.current_password
    delete data.new_password

    user.merge(data)
    await user.save()
    session.flash('success', 'User berhasil diedit!')
    return response.redirect().toRoute('UsersController.show', { id })
  }

  public async destroy({ params, session, response }: HttpContextContract) {
    const { id } = params
    const user = await User.findOrFail(id)
    await user.delete()
    session.flash('success', 'User berhasil dihapus!')
    response.redirect().toRoute('UsersController.index')
  }
}
