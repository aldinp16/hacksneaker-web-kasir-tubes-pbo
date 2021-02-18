import { AuthenticationException } from '@adonisjs/auth/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Admin {
  public async handle({ auth }: HttpContextContract, next: () => Promise<void>) {
    const isAdmin = auth.user && auth.user.level > 0
    if (isAdmin) {
      return next()
    }

    throw new AuthenticationException('Unauthorized access', 'E_UNAUTHORIZED_ACCESS')
  }
}
