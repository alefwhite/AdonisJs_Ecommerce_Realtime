'use strict'

class AdminStoreUser {
  get rules () {
    let user_id = this.ctx.params.id
    let rule = ''

    // significa que o usuário está atualizando
    if (user_id) {
      rule = `unique:users,email,id,${user_id}`
    } else {
      rule = 'unique:users,email|required'
    }

    return {
      // validation rules
      email: rule,
      image_id: 'exists:images,id'
    }
  }
}

module.exports = AdminStoreUser
