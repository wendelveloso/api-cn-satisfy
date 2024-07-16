const jwt = require('jsonwebtoken');
const knex = require("../configs/connection");
const senhaHash = process.env.JWT_KEY

const usuarioAutenticado = async (req, res, next) => {
  const { authorization } = req.headers;
  
  if (!authorization) {
    return res.status(401).json({
      mensagem:
        "Para acessar este recurso um token de autenticação válido deve ser enviado.",
    });
  }

  try {
    const token = authorization.split(" ")[1];
    const { id } = jwt.verify(token, senhaHash);
    const usuario = await knex("usuarios").where({ id }).first()

    if (!usuario) {
      return res.status(401).json({
        mensagem:
          "Usuario não encontrado",
      });
    }
    const { senha, ...usuarioLogado } = usuario
    req.usuario = usuarioLogado

    next();
  } catch (error) {
    return res.status(401).json({
      mensagem:
      "Erro interno no servidor",
    })
  }

}


module.exports = usuarioAutenticado

