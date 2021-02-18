import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async loginView({ auth, view, response }: HttpContextContract) {
    if (auth.isGuest) return view.render('pages/login')
    response.redirect().back()
  }

  public async login({ auth, request, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')
    const rememberUser = !!request.input('remember_me')
    await auth.attempt(email, password, rememberUser)
    response.redirect('/')
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.logout()
    response.redirect().toRoute('AuthController.loginView')
  }
}
