const knex = require("../configs/connection");

const cadastrarCliente = async (req, res) => {
  const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } =
    req.body;

  try {
    const emailExistente = await knex("clientes").where("email", email).first();
    if (emailExistente) {
      return res.status(400).json({ erro: "E-mail já está em uso" });
    }

    const cpfExistente = await knex("clientes").where("cpf", cpf).first();
    if (cpfExistente) {
      return res.status(400).json({ erro: "CPF já está em uso" });
    }

    const cliente = await knex("clientes")
      .insert({
        nome,
        email,
        cpf,
        cep,
        rua,
        numero,
        bairro,
        cidade,
        estado,
      })
      .returning("*");

    res.status(201).json(cliente);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro interno do sevidor.",
    });
  }
};

const atualizarCliente = async (req, res) => {
  const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } =
    req.body;
  const { id } = req.params;

  try {
    const existeCliente = await knex("clientes").where({ id }).first();
    if (!existeCliente) {
      return res.status(400).json({
        mensagem: "Cliente não encontrado.",
      });
    }

    const existeEmail = await knex("clientes").where({ email }).first();
    if (existeEmail && existeEmail.id != id) {
      return res.status(400).json({
        mensagem: "O email informado já existe.",
      });
    }

    const existeCPF = await knex("clientes").where({ cpf }).first();
    if (existeCPF) {
      return res.status(400).json({
        mensagem: "O CPF informado já existe.",
      });
    }

    const dadosAtualizado = await knex("clientes")
      .where({ id })
      .update({
        nome,
        email,
        cpf,
        cep,
        rua,
        numero,
        bairro,
        cidade,
        estado,
      })
      .returning("*");
    if (!dadosAtualizado) {
      return res.status(400).json({
        mensagem: "Não foi possivel atualizar os dados do cliente.",
      });
    }

    return res.status(201).json(dadosAtualizado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro interno do sevidor.",
    });
  }
};

const listaClientes = async (req, res) => {
  try {
    const todosOsClientes = await knex("clientes").select("*");

    return res.status(200).json(todosOsClientes);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro interno do sevidor.",
    });
  }
};

const detalharCliente = async (req, res) => {
  const clienteId = req.params.id;
  try {
    const cliente = await knex("clientes").where("id", clienteId).first();
    if (!cliente) {
      return res.status(404).json({ erro: "Cliente não encontrado" });
    }
    res.status(200).json(cliente);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro interno do sevidor.",
    });
  }
};

module.exports = {
  cadastrarCliente,
  atualizarCliente,
  listaClientes,
  detalharCliente,
};
