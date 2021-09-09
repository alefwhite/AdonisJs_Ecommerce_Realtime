'use strict'

class AuthRegister {
  get rules () {
    return {
      // validation rules
      name: 'required',
      surname: 'required',
      email: 'required|email|unique:users,email',
      password: 'required|confirmed' // password_confirmation === password

    }
  }

  get messages () {
    return {
      'name.required': 'O nome é obrigatório!',
      'surname.required': 'O sobrenome é obrigatório!',
      'email.required': 'O e-mail é obrigatório!',
      'email.email': 'E-mail inválido!',
      'email.unique': 'E-mail já existe!',
      'password.required': 'A senha é obrigatória!',
      'password.confirmed': 'As senhas não são iguais!',
    }
  }
}

module.exports = AuthRegister
