'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Product = use('App/Models/Product')
const ProductTransformer = use('App/Transformers/Admin/ProductTransformer')

/**
 * Resourceful controller for interacting with products
 */
class ProductController {
  /**
   * Show a list of all products.
   * GET products
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, pagination, transform }) {
    const name = request.input('name')

    // criando uma instancia da model Product
    const query = Product.query()

    if (name) query.where('name', 'LIKE', `%${name}%`)

    let products = await query.paginate(pagination.page, pagination.limit)

    products = await transform.item(products, ProductTransformer)

    return response.send(products)
  }

  /**
   * Create/save a new product.
   * POST products
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, transform }) {
    try {
      const {
        name,
        description,
        price,
        image_id
      } = request.only(['name', 'description', 'price', 'image_id'])

      let product = await Product.create({
        name,
        description,
        price,
        image_id
      })

      product = await transform.item(product, ProductTransformer)

      return response.status(201).send(product)
    } catch (error) {
      return response.status(400).send(
        { message: 'Não foi possível criar o produto neste momento'}
      )
    }
  }

  /**
   * Display a single product.
   * GET products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params: { id }, request, response, transform }) {
    let product = await Product.findOrFail(id)

    try {
      product = await transform.item(product, ProductTransformer)

      return response.send(product)
    } catch (error) {
      return response.status(500).send({
        message: 'Não foi possível lista o produto neste momento'
      })
    }
  }

  /**
   * Update product details.
   * PUT or PATCH products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params: { id }, request, response, transform }) {
    let product = await Product.findOrFail(id)

    try {
      const data = request.only(['name', 'description', 'price', 'image_id'])

      product.merge(data)

      await product.save()

      product = await transform.item(product, ProductTransformer)

      return response.send(product)
    } catch (error) {
      return response.status(500).send({
        message: 'Não foi possível editar o produto neste momento'
      })
    }
  }

  /**
   * Delete a product with id.
   * DELETE products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params: { id }, request, response }) {
    const product = await Product.findOrFail(id)

    try {

      product.delete()

      return response.status(204).send()
    } catch (error) {
      return response.status(500).send({
        message: 'Não foi possível deletar o produto neste momento'
      })
    }
  }
}

module.exports = ProductController
