'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use('App/Models/User')
const UserTransformer = use('App/Transformers/Admin/UserTransformer')

/**
 * Resourceful controller for interacting with users
 */
class UserController {
  /**
   * Show a list of all users.
   * GET users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, pagination, transform }) {
    const { name, surname, email} = request.get()
    try {
      let users = await User
        .query()
        .where(builder => {
          if (name) builder.where('name', 'LIKE', `%${name}%`)

          if (surname) builder.orWhere('surname', 'LIKE', `%${surname}%`)

          if (email) builder.orWhere('email', 'LIKE', `%${email}%`)
        })
        .paginate(pagination.page, pagination.limit)

      users = await transform.paginate(users, UserTransformer)

      return response.send(users)
    } catch (error) {
      console.log(error)
      return response.status(400).send({
        message: 'Erro ao listar usuários'
      })
    }
  }

  /**
   * Create/save a new user.
   * POST users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, transform }) {
    try {
      const data = request.only([
        'name',
        'surname',
        'email',
        'password',
        'image_id'
      ])

      let user = await User.create(data)

      user = await transform.item(user, UserTransformer)

      return response.status(201).send(user)
    } catch (error) {
      return response.send({
        message: 'Erro ao criar usuário'
      })
    }
  }

  /**
   * Display a single user.
   * GET users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params: { id }, request, response, transform}) {
    let user = await User.findOrFail(id)
    try {
      user = await transform.item(user, UserTransformer)

      return response.send(user)
    } catch (error) {
      return response.status(500).send({
        message: 'Algo aconteceu ao procurar usuário'
      })
    }
  }

  /**
   * Update user details.
   * PUT or PATCH users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params: { id }, request, response, transform }) {
    let user = await User.findOrFail(id)
    try {
      const data = request.post()

      user.merge(data)

      await user.save()

      user = await transform.item(user, UserTransformer)

      return response.send(user)
    } catch (error) {
      return response.status(500).send({
        message: 'Algo aconteceu ao editar usuário'
      })
    }
  }

  /**
   * Delete a user with id.
   * DELETE users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params: { id }, request, response }) {
    const user = await User.findOrFail(id)
    try {
      await user.delete()

      return response.status(204).send()
    } catch (error) {
      return response.status(500).send({
        message: 'Algo aconteceu ao deletar usuário'
      })
    }
  }
}

module.exports = UserController
