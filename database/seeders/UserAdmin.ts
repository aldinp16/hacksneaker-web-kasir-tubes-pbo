import User from 'App/Models/User'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

export default class UserAdminSeeder extends BaseSeeder {
  public async run() {
    const searchPayload = { email: 'me@aldi.dev' }
    const savePayload = {
      fullName: 'Aldi Nugraha',
      email: 'me@aldi.dev',
      level: 1,
      password: 'aldi123',
    }

    await User.firstOrCreate(searchPayload, savePayload)
  }
}
