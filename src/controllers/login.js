const knex = require("../configs/connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const usuarioLogin = async (req, res) => {
    const { email, senha } = req.body;
   
    try {
      const usuario = await knex("usuarios")
        .where("email", email)
        .first();
  
      if (!usuario) {
        return res.status(404).json({ mensagem: "Usuário e/ou senha inválido(s)." });
      }
  
      const validarSenha = await bcrypt.compare(senha, usuario.senha);
  
      if (!validarSenha) {
        return res.status(400).json({ mensagem: "Usuário e/ou senha inválido(s)." });
      }
  
      const token = jwt.sign({ id: usuario.id }, process.env.JWT_KEY, {
        expiresIn: "4h"});
  
      const { senha: _, ...usuarioLogado } = usuario;
      return res.status(200).json({ usuario: usuarioLogado, token }); 
    } catch (error) {
      return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
  }

module.exports = usuarioLogin
