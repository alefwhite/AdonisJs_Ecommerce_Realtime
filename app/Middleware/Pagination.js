'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class Pagination {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle (ctx, next) {
    // call next to advance the request
    if(ctx.request.method() === 'GET') {
      const { page, limit } = ctx.request.get()
      const perpage = ctx.request.input('perpage')

      // Atribui os valores passados via get para a propriedade pagination do objeto ctx
      ctx.pagination = {
        page: Number(page),
        limit: Number(limit)
      }

      if (perpage) {
        ctx.pagination.limit = Number(perpage)
      }
    }

    await next()
  }
}

module.exports = Pagination
