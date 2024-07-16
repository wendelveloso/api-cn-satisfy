const knex = require("../configs/connection");

const listarCategorias = async (req, res) => {
  try {
    const listagem = await knex("categorias");

    return res.status(200).json(listagem);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

module.exports = listarCategorias

