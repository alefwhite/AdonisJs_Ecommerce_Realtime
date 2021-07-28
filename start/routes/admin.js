'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
  /*
  *   Categories resource route
  * */
  Route.resource('categories', 'CategoryController')
    .apiOnly()

  /*
  *   Products resource route
  * */
  Route.resource('products', 'ProductController')
    .apiOnly()

  /*
  *   Coupon resource route
  * */
  Route.resource('coupons', 'CouponController')
    .apiOnly()

  /*
  *   Images resource route
  * */
  Route.resource('orders', 'OrderController')
    .apiOnly()

  /*
  *   Images resource route
  * */
  Route.resource('images', 'ImageController')
    .apiOnly()


  /*
  *   User resource route
  * */
  Route.resource('users', 'UserController')
    .apiOnly()
})
.prefix('v1/admin')
.as('Admin')
