'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const CouponTransformer = use('App/Transformers/Admin/CouponTransformer')

/**
 * DiscountTransformer class
 *
 * @class DiscountTransformer
 * @constructor
 */
class DiscountTransformer extends BumblebeeTransformer {
  static get defaultInclude () {
    return ['coupon']
  }

  transform (discount) {
    return {
      id: discount.id,
      amount: discount.discount
    }
  }

  includeCoupon (discount) {
    return this.item(discount.getRelated('coupon'), CouponTransformer)
  }

}

module.exports = DiscountTransformer
