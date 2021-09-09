'use strict'

class Login {
  get rules () {
    return {
      // validation rules
      email: 'required|email',
      password: 'required'
    }
  }

  get messages () {
    return {
      'email.required': 'O e-mail é obrigatório!',
      'password.required': 'A senha é obrigatória!'
    }
  }

  get validateAll () {
    return true
  }
}

module.exports = Login
