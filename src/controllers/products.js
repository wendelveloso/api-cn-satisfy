const knex = require("../configs/connection");
const { uploadDeArquivo, excluirArquivo } = require("../configs/storage");

const cadastrarProduto = async (req, res) => {
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
  const { file } = req;

  try {
    const listarCategoriaExistente = await knex("categorias")
      .where({ id: categoria_id })
      .first();

    if (!listarCategoriaExistente) {
      return res.status(400).json("A categoria_id não existe");
    }

    const produto = await knex("produtos")
      .insert({
        descricao,
        quantidade_estoque,
        valor,
        categoria_id,
      })
      .returning("*");

    if (file) {
      const arquivo = await uploadDeArquivo(
        `produto_imagem/${produto[0].id}/${file.originalname}`,
        file.buffer,
        file.mimetype
      );

      const produtoComImagem = await knex("produtos")
        .update({
          produto_imagem: arquivo.url,
        })
        .where({ id: produto[0].id })
        .returning("*");
        

      return res.status(201).json(produtoComImagem);
    }

    return res.status(201).json(produto);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro interno do servidor",
    });
  }
};

const detalharProduto = async (req, res) => {
  const { id } = req.params;

  try {
    const produto = await knex("produtos").where({ id }).first();

    if (!produto) {
      return res.status(404).json({ mensagem: "Produto inexistente." });
    }
    return res.status(200).json(produto);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro interno do servidor",
    });
  }
};

const listarProdutos = async (req, res) => {
  const { categoria_id } = req.query;

  try {
    const listagemProdutos = await knex("produtos");

    if (categoria_id) {
      const listarProdutosCategorias = await knex("produtos").where({
        categoria_id,
      });
      return res.status(200).json(listarProdutosCategorias);
    }

    return res.status(201).json(listagemProdutos);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro interno do servidor",
    });
  }
};

const editarProduto = async (req, res) => {
  const { id } = req.params;
  const { descricao, quantidade_estoque, valor, categoria_id, produto_imagem } =
    req.body;
  const { file } = req;

  try {
    const produtoExistente = await knex("produtos").where({ id }).first();

    if (!produtoExistente) {
      return res.status(404).json({ mensagem: "Produto não encontrado." });
    }

    const categoriaExistente = await knex("categorias")
      .where({ id: categoria_id })
      .first();

    if (!categoriaExistente) {
      return res
        .status(400)
        .json({ mensagem: "A categoria informada não existe." });
    }

    const { produto_imagem: url } = produtoExistente;

    if (file && url) {
      const index = url.indexOf("produto_imagem");
      const path = url.slice(index);
      await excluirArquivo(path);

      const todosProduto = await knex("produtos")
        .where({
          id,
        })
        .first();

      const arquivo = await uploadDeArquivo(
        `produto_imagem/${todosProduto.id}/${file.originalname}`,
        file.buffer,
        file.mimetype
      );

      const produtoAtualizado = await knex("produtos")
        .where({ id })
        .update({
          descricao,
          quantidade_estoque,
          valor,
          categoria_id,
          produto_imagem: arquivo.url,
        })
        .returning("*");

      return res.status(200).json(produtoAtualizado);
    }

    if (file) {
      const todosProduto = await knex("produtos")
        .where({
          id,
        })
        .first();

      const arquivo = await uploadDeArquivo(
        `produto_imagem/${todosProduto.id}/${file.originalname}`,
        file.buffer,
        file.mimetype
      );

      const produtoAtualizado = await knex("produtos")
        .where({ id })
        .update({
          descricao,
          quantidade_estoque,
          valor,
          categoria_id,
          produto_imagem: arquivo.url,
        })
        .returning("*");

      return res.status(200).json(produtoAtualizado);
    }

    const produtoAtualizado = await knex("produtos")
      .where({ id })
      .update({
        descricao,
        quantidade_estoque,
        valor,
        categoria_id,
      })
      .returning("*");

    return res.status(200).json(produtoAtualizado);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

const deletarProduto = async (req, res) => {
  const { id } = req.params;
  const { usuario } = req;
  if (!id) {
    return res.status(404).json("O id do produto precisa ser informado");
  }

  try {
    const produtoEmPedido = await knex("pedido_produtos")
      .where({ produto_id: id })
      .first();
    if (produtoEmPedido) {
      return res
        .status(400)
        .json({
          mensagem:
            "O produto está vinculado a um pedido e não pode ser excluído",
        });
    }

    const produto = await knex("produtos").where({ id }).first();
    if (!produto) {
      return res.status(404).json({ mensagem: "Produto não encontrado" });
    }
    const { produto_imagem: url } = produto;

    if (produto.produto_imagem) {
      const index = url.indexOf("produto_imagem");
      const path = url.slice(index);
      await excluirArquivo(path);
    }

    const deletarArquivo = await knex("produtos").where({ id }).del();

    if (!deletarArquivo) {
      return res.status(400).json({ mensagem: "O produto não foi deletado" });
    }
    return res.status(200).json(produto);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

module.exports = {
  cadastrarProduto,
  listarProdutos,
  cadastrarProduto,
  detalharProduto,
  editarProduto,
  deletarProduto,
};  
