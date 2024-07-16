const knex = require("../configs/connection");
const transportador = require("../configs/nodemailer");
const compiladorHtml = require("../utils/compiler-html");
const formatarEmReais = require("../utils/format-value");

const cadastrarPedido = async (req, res) => {
  const { cliente_id, observacao, pedido_produtos } = req.body;

  try {
    const cliente = await knex("clientes").where({ id: cliente_id }).first();
    if (!cliente) {
      return res.status(400).json({ mensagem: "Cliente não encontrado." });
    }
    const idsProdutosBody = pedido_produtos.map(
      (produto) => produto.produto_id
    );
    const produto = await knex("produtos").whereIn("id", idsProdutosBody);
    const idsProdutosBd = produto.map((produto) => produto.id);
    const idProdutoExiste = idsProdutosBody.every((currentValue) =>
      idsProdutosBd.includes(currentValue)
    );

    if (pedido_produtos.length === 0) {
      return res.status(400).json({
        mensagem: "Ao menos um produto precisa ser inserido ao pedido",
      });
    }
    if (!idProdutoExiste) {
      return res
        .status(400)
        .json({ mensagem: "Id informado do produto não existe" });
    }

    const quantidadeProdutoBd = produto.map(
      (quantidade) => quantidade.quantidade_estoque
    );
    const quantidadeProdutoBody = pedido_produtos.map(
      (quantidade) => quantidade.quantidade_produto
    );
    const estoqueSuficienteProdutos = quantidadeProdutoBd
      .map((quantidade, indice) => quantidade >= quantidadeProdutoBody[indice])
      .every((valor) => valor);

    if (!estoqueSuficienteProdutos) {
      return res
        .status(400)
        .json({ mensagem: "Estoque indisponível para essa quantidade" });
    }

    let valorTotal = 0;

    for (let i = 0; i < pedido_produtos.length; i++) {
      const produtoArray = pedido_produtos[i];
      const valorProduto = produto[i].valor;
      const valorQuantidadeTotal =
        valorProduto * produtoArray.quantidade_produto;
      valorTotal += valorQuantidadeTotal;
    }

    const pedido = await knex("pedidos")
      .insert({ cliente_id, observacao, valor_total: valorTotal })
      .returning("*");

    await knex.transaction(async (trans) => {
      for (const produtoPedido of pedido_produtos) {
        await trans("pedido_produtos").insert({
          pedido_id: pedido[0].id,
          produto_id: produtoPedido.produto_id,
          quantidade_produto: produtoPedido.quantidade_produto,
          valor_produto: produto[0].valor,
        });

        await trans("produtos")
          .where("id", produtoPedido.produto_id)
          .decrement("quantidade_estoque", produtoPedido.quantidade_produto);
      }
    });

    const html = await compiladorHtml("./src/templates/login.html", {
      nomeusuario: req.usuario.nome,
      valorpedido: formatarEmReais(valorTotal),
    });

    await transportador.sendMail({
      from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_FROM}>`,
      to: `${req.usuario.nome} <${req.usuario.email}>`,
      subject: "Cadastro de Pedido",
      html,
    });

    return res.status(201).json(pedido);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

const listarPedidos = async (req, res) => {
  try {
    let pedidosFinal = [];
    const pedidosResultados = await knex("pedidos").select("*");

    for (let pedido of pedidosResultados) {
      const produtosDoPedido = await knex("pedido_produtos")
        .where("pedido_id", pedido.id)
        .select("*");
      const produtosSemEspacos = produtosDoPedido.map((produto) => ({
        id: produto.id,
        quantidade_produto: produto.quantidade_produto,
        valor_produto: produto.valor_produto,
        pedido_id: produto.pedido_id,
        produto_id: produto.produto_id,
      }));

      pedidosFinal.push({
        pedido: {
          id: pedido.id,
          valor_total: pedido.valor_total,
          observacao: pedido.observacao,
          cliente_id: pedido.cliente_id,
        },
        pedido_produtos: produtosSemEspacos,
      });
    }

    if (req.params.id) {
      const clienteId = parseInt(req.params.id, 10);
      pedidosFinal = pedidosFinal.filter(
        (pedido) => pedido.pedido.cliente_id === clienteId
      );

      if (pedidosFinal.length === 0) {
        return res
          .status(404)
          .json({ mensagem: "Pedidos para o cliente não encontrados." });
      }
    }

    res.status(200).json(pedidosFinal);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

const listarPedidosId = async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await knex("pedidos").where("id", id).first();

    if (!pedido) {
      return res.status(404).json({ mensagem: "Pedido não encontrado." });
    }

    const itens = await knex("pedido_produtos")
      .where("pedido_id", id)
      .select("*");

    const itensSemEspacos = itens.map((item) => ({
      id: item.id,
      quantidade_produto: item.quantidade_produto,
      valor_produto: item.valor_produto,
      pedido_id: item.pedido_id,
      produto_id: item.produto_id,
    }));

    const resposta = [
      {
        pedido: {
          id: pedido.id,
          valor_total: pedido.valor_total,
          observacao: pedido.observacao,
          cliente_id: pedido.cliente_id,
        },
        pedido_produtos: itensSemEspacos,
      },
    ];

    res.status(200).json(resposta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};
module.exports = { listarPedidos, listarPedidosId, cadastrarPedido };
