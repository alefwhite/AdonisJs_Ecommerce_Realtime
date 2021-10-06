'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Coupon = use('App/Models/Coupon')
const Database = use('Database')
const CouponService = use('App/Service/Coupon/CouponService')
const CouponTransformer = use('App/Transformers/Admin/CouponTransformer')


/**
 * Resourceful controller for interacting with coupons
 */
class CouponController {
  /**
   * Show a list of all coupons.
   * GET coupons
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {object} ctx.pagination
   */

  async index ({ request, response, pagination, transform }) {
    const code = request.input("code")
    const query = Coupon.query()

    if (code) {
      query
        .where('code', 'LIKE', `%${code}%`)
    }

    let coupons = await query
      .paginate(pagination.page, pagination.limit)

    coupons = await transform.paginate(coupons, CouponTransformer)

    return response.send(coupons)
  }

  /**
   * Create/save a new coupon.
   * POST coupons
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, transform }) {
    /*
    *   1 - produto | pode ser utilizado apenas em produtos especificos
    *   2 - clientes | pode ser utilizado apenas por clientes especificos
    *   3 - clientes | pode ser utilizado somente em produstos e clientes especificos
    *   4 - pode ser utilizado por qualquer cliente em qualquer pedido
    * */

    const Trx = await Database.beginTransaction()

    let can_use_for = {
      client: false,
      product: false
    }

    try {
      const couponData = request.only([
        'code',
        'discount',
        'valid_from',
        'valid_until',
        'quantity',
        'type',
        'recursive'
      ])

      const { users, products } = request.post()

      let coupon = await Coupon.create(couponData, trx)

      // starts service layer
      const service = new CouponService(coupon, Trx)

      // insere os relacionamentos no DB
      if (users && users.length > 0) {
        await service.syncUsers(users)
        can_use_for.client = true
      }

      if (products && products.length > 0) {
        await service.syncProducts(products)
        can_use_for.product = true
      }

      if (can_use_for.product && can_use_for.client) {
        coupon.can_use_for= 'product_client'
      } else if (can_use_for.product && !can_use_for.client) {
        coupon.can_use_for= 'product'
      } else if (!can_use_for.product && can_use_for.client) {
        coupon.can_use_for= 'client'
      } else {
        coupon.can_use_for= 'all'
      }

      await coupon.save(Trx)

      await Trx.commit()

      coupon = await transform.item(coupon, CouponTransformer)

      return response.status(201).send(coupon)
    } catch (error) {
      await Trx.rollback()

      return response.status(400).send({ message: 'Não foi possível criar cupom nesse momento!' })
    }
  }

  /**
   * Display a single coupon.
   * GET coupons/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async show ({ params: { id }, request, response,  transform }) {
    let coupon = await Coupon.findOrFail(id)

    coupon = await transform.item(coupon, CouponTransformer)

    return response.send(coupon)
  }

  /**
   * Update coupon details.
   * PUT or PATCH coupons/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params: { id }, request, response, transform }) {
    const Trx = await Database.beginTransaction()

    let coupon = await Coupon.findOrFail(id)

    let can_use_for = {
      client: false,
      product: false
    }

    try {
      const couponData = request.only([
        'code',
        'discount',
        'valid_from',
        'valid_until',
        'quantity',
        'type',
        'recursive'
      ])

      coupon.merge(couponData)

      const { user, products } = request.post()

      const service = new CouponService(coupon, Trx)

      // insere os relacionamentos no DB
      if (users && users.length > 0) {
        await service.syncUsers(users)
        can_use_for.client = true
      }

      if (products && products.length > 0) {
        await service.syncProducts(products)
        can_use_for.product = true
      }

      if (can_use_for.product && can_use_for.client) {
        coupon.can_use_for= 'product_client'
      } else if (can_use_for.product && !can_use_for.client) {
        coupon.can_use_for= 'product'
      } else if (!can_use_for.product && can_use_for.client) {
        coupon.can_use_for= 'client'
      } else {
        coupon.can_use_for= 'all'
      }

      await coupon.save(Trx)

      await Trx.commit()

      coupon = await transform.item(coupon, CouponTransformer)

      return response.status(200).send(coupon)
    } catch (error) {
      return response.status(400).send({ message: 'Não foi possivel alterar o cupom nesse momento!' })
    }
  }

  /**
   * Delete a coupon with id.
   * DELETE coupons/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params: { id }, request, response }) {
    const Trx = await Database.beginTransaction()
    const coupon = await Coupon.findOrFail(id)
    try {
      await coupon
        .products()
        .detach([], Trx)

      await coupon
        .orders()
        .detach([], Trx)

      await coupon
        .users()
        .detach([], Trx)

      await coupon
        .delete(trx)

      await Trx.commit()

      return response.status(204).send()
    } catch (error) {
      await Trx.rollback()

      return response.status(400).send({ message: 'Não foi possível deletar esse cupom no momento!' })
    }
  }
}

module.exports = CouponController
