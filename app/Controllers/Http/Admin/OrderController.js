'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Order = use('App/Models/Order')
const Database = use('Database')
const Service = use('App/Services/Order/OrderService')

/**
 * Resourceful controller for interacting with orders
 */
class OrderController {
  /**
   * Show a list of all orders.
   * GET orders
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {object} ctx.pagination
   */
  async index ({ request, response, pagination }) {
    const { status, id } = request.only(['status', 'id'])

    const orders = await Order
      .query()
      .where(builder => {
        if (status && id) {
          builder.where('id', 'LIKE', `%${id}%`)
          builder.orWhere('status', status)
        }
        else if (status) {
          builder.where('status', status)
        }
        else if (id) {
          builder.where('id', 'LIKE', `%${id}%`)
        }
      })
      .paginate(pagination.page, pagination.limit)

    return response.send(orders)
  }


  /**
   * Create/save a new order.
   * POST orders
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    const Trx = await Database.beginTransaction()

    try {
      const { user_id, items, status } = request.all()

      let order = await Order.create({ user_id, status }, Trx)

      const service = new Service(order, trx)

      if (items && items.length > 0) {
        await service.syncItems(items)
      }

      await Trx.commit()

      return response.status(201).send(order)
    } catch (error) {
      await Trx.rollback()

      return response.status(400).send({ message: 'Algo deu errado ao criar pedido!' })
    }
  }

  /**
   * Display a single order.
   * GET orders/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async show ({ params: { id }, request, response }) {
    const order = await Order.findOrFail(id)

    return response.send(order)
  }

  /**
   * Update order details.
   * PUT or PATCH orders/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params: { id }, request, response }) {
    const order = await Order.findOrFail(id)
    const Trx = await Database.beginTransaction()

    try {
      const { user_id, items, status } = request.all()

      order.merge({ user_id, status })

      const service = new Service(order, Trx)

      await service.updateItems(items)

      await order.save(Trx)

      await Trx.commit()

      return response.send(order)
    } catch (error) {
      await Trx.rollback()

      return response.status(400).send({ message: 'Não foi possível atualizar o pedido!' })
    }
  }

  /**
   * Delete a order with id.
   * DELETE orders/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const order = await Order.findOrFail(id)
    const Trx = await Database.beginTransaction()
    try {
      await order.items().delete(Trx)
      await order.coupons().delete(Trx)
      await order.delete(Trx)

      await Trx.commit()

      return response.status(204).send()
    } catch (error) {
      await Trx.rollback()
      return response.status(400).send({ message: 'Algo deu errado ao deletar pedido!' })
    }
  }
}

module.exports = OrderController
