import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Product from 'App/Models/Product'

export default class SampleProductSeeder extends BaseSeeder {
  public async run() {
    const vansOldSchool = new Product()
    vansOldSchool.name = 'Old School'
    vansOldSchool.brand = 'Vans'
    vansOldSchool.note =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac interdum quam, vel imperdiet urna. Integer ac lorem urna. Pellentesque nec nisl id urna aliquet mattis varius at sapien. Ut porttitor, tortor sed mattis eleifend, est purus posuere augue, vitae suscipit purus neque fringilla augue. Vestibulum lacinia quam ac ipsum interdum, feugiat tempus purus eleifend. In dui sem, iaculis vel nunc vitae, ullamcorper cursus erat. Aliquam purus tellus, convallis non velit id, rutrum gravida mi. Sed suscipit eget tellus ut condimentum. Nullam at sem magna. Fusce ornare aliquam neque vitae ullamcorper.'
    vansOldSchool.price = 140000
    await vansOldSchool.save()
  }
}
