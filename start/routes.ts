/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', 'DashboardController.index').middleware(['auth'])
Route.get('/api/products', 'ProductsController.selectApi').middleware(['auth'])
Route.resource('/users', 'UsersController').middleware({ '*': ['auth', 'admin'] })
Route.resource('/products', 'ProductsController').middleware({
  '*': ['auth'],
  'destroy': ['admin'],
})
Route.resource('/transactions', 'TransactionsController').middleware({
  '*': ['auth'],
  'destroy': ['admin'],
})

Route.get('/login', 'AuthController.loginView')
Route.post('/login', 'AuthController.login')
Route.get('/logout', 'AuthController.logout').middleware(['auth'])
