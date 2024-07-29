const knex = require("../configs/connection");
const bcrypt = require("bcrypt");

const cadastarUsuarios = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const quantidadeUsuarios = await knex("usuarios").where({ email }).first();

    if (quantidadeUsuarios) {
      return res.status(400).json({
        messagem: "O email informado já existe",
      });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const usuario = await knex("usuarios")
      .insert({
        nome,
        email,
        senha: senhaCriptografada,
      })
      .returning("*")
      .debug();

    return res.status(200).json(usuario);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro interno do servidor", 
    });
  }  
};

const detalharPerfilUsuario = async (req, res) => {
  res.status(200).json(req.usuario);
};

const atualizarPerfilUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;
  const { id } = req.usuario;
  try {
    const existeEmail = await knex("usuarios").where({ email }).first();

    if (existeEmail && existeEmail.id != id) {
      return res.status(400).json({
        mensagem: "O email informado já existe",
      });
    }

    const hash = await bcrypt.hash(senha, 10);

    const usuario = await knex("usuarios")
      .where({ id })
      .update({
        nome,
        email,
        senha: hash,
      })
      .returning("*");
    res.status(201).json(usuario);
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro interno do servidor",
    });
  }
};

module.exports = {
  cadastarUsuarios,
  detalharPerfilUsuario,
  atualizarPerfilUsuario,  
};
