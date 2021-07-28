'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
  /*
  *   Product Resource Routes
  * */
  Route.get('products', 'ProductController.index')
    .apiOnly()
  Route.get('products/:id', 'ProductController.show')
    .apiOnly()

  /*
  *   Order Resource Routes
  * */
  Route.get('orders', 'OrderController.index')
    .apiOnly()
  Route.get('orders/:id', 'OrderController.show')
    .apiOnly()
  Route.post('orders', 'OrderController.store')
    .apiOnly()
  Route.put('orders/:id', 'OrderController.update')
    .apiOnly()

})
.prefix('v1')
.namespace('Client')
