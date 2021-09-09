'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
  /*
  *   Categories resource route / adonis route:list | grep StoreCategory
  * */
  Route.resource('categories', 'CategoryController')
    .apiOnly()
    .validator(new Map([
      [['categories.store'],  ['Admin/StoreCategory']],
      [['categories.update'], ['Admin/StoreCategory']]
    ]))

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
 *   Order Resource Rutes
 * */
  Route.post('orders/:id/discount', 'OrderController.applyDiscount')
  Route.delete('orders/:id/discount', 'OrderController.removeDiscount')
  Route.resource('orders', 'OrderController')
    .apiOnly()
    .validator(new Map([
      [['orders.store'], ['Admin/StoreOrder']]
    ]))

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
.namespace('Admin')
.middleware(['auth', 'is:( admin || manager )'])
