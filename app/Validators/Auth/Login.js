'use strict'

class Login {
  get rules () {
    return {
      // validation rules
      email: 'required|email',
      password: 'return'
    }
  }
}

module.exports = Login
