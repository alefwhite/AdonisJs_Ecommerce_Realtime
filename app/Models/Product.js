'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Product extends Model {
  // Relacionamento entre Produto e Imagem de destaque
  image () {
    return this.belongsTo('App/Models/Image')
  }

  // Relacionamento entre produto e imagens (galeria de imagens do produto)
  images () {
    return this.belongsToMany('App/Models/Image')
  }

  // Relacionamento entre Produtos e Categorias
  categories () {
    return this.belongsToMany('App/Models/Category')
  }

  // Relacionamento entre produtos e coupons de desconto
  coupons () {
    return this.belongsToMany('App/Models/Coupon')
  }
}

module.exports = Product
