'use strict'

class CouponService {
    constructor (Model, Trx = null) {
      this.Model = Model
      this.Trx = Trx
    }

    async syncUsers (users) {
      if (!Array.isArray(users)) {
        return false
      }

      await this.Model.users().sync(users, null, this.Trx)
    }

    async syncOrders (orders) {
      if (!Array.isArray(orders)) {
        return false
      }

      await this.Model.orders().sync(orders, null, this.Trx)
    }

    async syncProducts (products) {
      if (!Array.isArray(products)) {
        return false
      }

      await this.Model.products().sync(products, null, this.Trx)
    }
}

module.exports = CouponService
