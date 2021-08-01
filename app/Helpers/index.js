'use strict'

const crypto = use('crypto')
const Helpers = use('Helpers')

/**
*   Generate random string
*   @param { int } length - O tamanho da string que você quer gerar
*   @return { string } uma string randomica do tamanho de length
* */

const str_random = async (length = 40) => {
  let string = ''
  let len = string.length

  if (len < length) {
    let size = length - len
    let bytes = await crypto.randomBytes(size)
    let buffer = Buffer.from(bytes)

    string += buffer
      .toString('base64')
      .replace(/[^a-zA-Z0-9]/g, '')
      .substr(0, size)
  }

  return string
}

/**
*   Move um único arquivo para o caminho especificado, se senhum caminho for especificado
*   então 'public/uploads' será utilizado
*   @param { FileJar } file o arquivo s ser gerenciado
 *  @param { string } path o caminho para onde o arquivo deve ser movido
 *  @return { Object<FileJar> }
*/

const manage_sigle_upload = async (file, path = null) => {
    path = path ? path : Helpers.publicPath('uploads')

    // GERA UM NOME ALEATÓRIO
    const random_name = await str_random(30)

    let filename = `${new Date.getTime()}-${random_name}.${file.subtype}`

    // RENOMEIA O ARQUIVO E MOVE ELE PARA O PATH
    await file.move(path, {
      name: filename
    })

    return file
}

/**
 *   Move um múltiplos arquivos para o caminho especificado,
 *   se senhum caminho for especificado
 *   então 'public/uploads' será utilizado
 *   @param  { FileJar } file o arquivo s ser gerenciado
 *   @param  { string } path o caminho para onde o arquivo deve ser movido
 *   @return { Object }
 */

const manage_multiple_upload = async (fileJar, path = null) => {
  path = path ? path : Helpers.publicPath('uploads')

  let successes = [], errors = []

  await Promise.all(fileJar.files.map(async file => {
      let random_name = await str_random(30)

      let filename = `${new Date.getTime()}-${random_name}.${file.subtype}`

      // move o arquivo
      await file.move(path, {
        name: filename
      })

      // Verificamos se moveu mesmo
      if (file.moved()) {
        successes.push(file)
      } else {
        errors.push(file.erro())
      }

  }))

  return { successes, errors }
}


module.exports = {
  str_random,
  manage_sigle_upload,
  manage_multiple_upload
}
