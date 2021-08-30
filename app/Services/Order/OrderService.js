'use strict'

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
}

module.exports = OrderService
