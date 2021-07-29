'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Category = use('App/Models/Category')

/**
 * Resourceful controller for interacting with categories
 */
class CategoryController {
  /**
   * Show a list of all categories.
   * GET categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   * @param {object} ctx.pagination
   */
  async index ({ request, response, pagination }) {
    const { title } = request.get()

    // criando uma instancia da model Category
    const query = Category.query()

    if (title) query.where('title', 'LIKE', `%${title}%`)

    const categories = await query.paginate(pagination.page, pagination.limit)

    return response.send(categories)
  }

   /**
   * Create/save a new category.
   * POST categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    try {
      const { title, description, image_id } = request.all()

      const category = await Category.create({ title, description, image_id})

      return response.status(201).send(category)

    } catch (error) {
      return response.status(400).send({
        message: 'Erro ao processar a sua solicitação'
      })
    }
  }

  /**
   * Display a single category.
   * GET categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params: { id }, request, response }) {
    const category = await Category.findOrFail(id)

    try {
      return response.send(category)
    } catch (error) {
      return response.status(500).send({
        message: 'Algo deu errado ao listar categoria'
      })
    }
  }

  /**
   * Update category details.
   * PUT or PATCH categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params: { id }, request, response }) {
    const category = await Category.findOrFail(id)

    try {
      const data = request.post()

      category.merge(data)

      await category.save()

      return response.status(200).send(category)
    } catch (error) {
      return response.status(500).send({
        message: 'Algo deu errado ao editar categoria'
      })
    }
  }

  /**
   * Delete a category with id.
   * DELETE categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params: { id }, request, response }) {
    const category = await Category.findOrFail(id)

    try {
      await category.delete()

      return response.status(204).send()
    } catch (error) {
      return response.status(500).send({
        message: 'Algo deu errado ao deletar categoria'
      })
    }
  }
}

module.exports = CategoryController
