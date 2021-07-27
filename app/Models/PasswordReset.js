'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class PasswordReset extends Model {

  static boot () {
    super.boot()

    this.addHook('beforeCreate', async modelInstance => {
      modelInstance.token = await str_random(25)

      const expires_at = new Date()

      expires_at.setMinutes(expires_at.getMinutes() + 30)

      modelInstance.expires_at = expires_at
    })
  }

  // Formata os valores para o padrão do MYSQL ou banco de dados que vc esteja usando
  static get dates () {
    return ['created_at', 'updated_at', 'expires_at']
  }

}

module.exports = PasswordReset
