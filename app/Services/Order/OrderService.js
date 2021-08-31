'use strict'

const Database = use('Database')

class OrderService {
  constructor (Model, Trx = null) {
    this.Model = Model
    this.Trx = Trx
  }

  async syncItems (items) {
    if (!Array.isArray(items)) {
      return false
    }

    await this.Model.items().delete(this.Trx)
    await this.Model.items().createMany(items, this.Trx)
  }

  async updateItems (items) {
    let current_items = await this.Model
      .items()
      .whereIn('id', items.map(item => item.id))
      .fetch()

    // Deleta os itens que o user não quer mais
    await this.Model
      .items()
      .whereNotIn('id', items.map(item => item.id))
      .delete(this.Trx)

    // Atualiza os valores e quantidade
    await Promise.all(current_items.rows.map(async item => {
      item.fill(items.find(n => n.id === item.id))

      await item.save(this.Trx)
    }))
  }

  async canApplyDiscount (coupon) {
    const couponProducts = await Database.from('coupon_products')
      .where('coupon_id', coupon.id)
      .pluck('product_id')

    const couponClients = await Database.from('coupon_user')
      .where('coupon_id', coupon.id)
      .pluck('user_id')

    // Verificar se o cupom está associado a produtos & clientes especificos
    if (Array.isArray(couponProducts) && couponProducts.length < 1 &&
        Array.isArray(couponClients) && couponClients.length < 1) {
      /*
      *   Caso não esteja associado a cliente ou produto especifico, é de uso livre
      * */
      return true
    }

    let isAssociatedToProducts, isAssociatedToClients = false

    if (Array.isArray(couponProducts) && couponProducts.length > 0) {
      isAssociatedToProducts = true
    }

    if (Array.isArray(couponClients) && couponClients.length > 0) {
      isAssociatedToClients = true
    }

    const productsMatch = await Database.from('order_items')
      .where('order_id', this.Model.id)
      .whereIn('product_id_', couponProducts)
      .pluck('product_id')

    /*
    *   Caso de uso 1 - O cupom está associado a clientes & produtos
    * */

    if (isAssociatedToClients && isAssociatedToProducts) {
      const clientMatch = couponClients.find(clientId => clientId === this.Model.user_id)

      if (clientMatch && Array.isArray(productsMatch) && productsMatch.length > 0) return true

    }

    /*
    *   Caso de uso 2 - o cupom está associado apenas ao produto
    * */
    if (isAssociatedToProducts && Array.isArray(productsMatch) && productsMatch.length > 0) return true

    /*
    *   Caso de uso 3 - O cupom está associado a 1 ou mais clientes (e nenhum produto)
    * */
    if (isAssociatedToClients && Array.isArray(couponClients) && couponClients.length > 0) {
      const match = couponClients.find(clientId => clientId === this.Model.user_id)

      if (match) {
        return true
      }
    }

    /*
    * Caso nenhum das verificações acima deem positivas, então o cupom está associado a clientes ou produtos ou
    * os dois, porém nenhum dos produtos deste pedido está aelegível ao desconto e o cliente que fez a compra também
    * não poderá utilizar este cupom
    * */
    return false
  }
}

module.exports = OrderService
