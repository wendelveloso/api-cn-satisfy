const express = require("express");

const listarCategorias = require("./controllers/categories");
const users = require("./controllers/users");
const products = require("./controllers/products");
const usuarioLogin = require("./controllers/login");
const {
  cadastrarCliente,
  atualizarCliente,
  listaClientes,
  detalharCliente,
} = require("./controllers/clients");
const { cadastrarPedido } = require("./controllers/ordereds");

const validarRequisicao = require("./middlewares/validatRequest");
const usuarioAutenticado = require("./middlewares/authentication");
const multer = require("./configs/multer");
const { listarPedidos, listarPedidosId } = require("./controllers/ordereds");

const schemaUpdateUsuarios = require("./validations/schemaUpdateUsers");
const schemaRegistrarUsuarios = require("./validations/schemaRegisterUsers");
const schemaLogin = require("./validations/schemaLoginUser");
const schemaRegistrarProdutos = require("./validations/schemaRegisterProducts");
const schemaClient = require("./validations/schemaClient");


const routes = express();

routes.get("/categoria", listarCategorias);
routes.post("/usuario", validarRequisicao(schemaRegistrarUsuarios), users.cadastarUsuarios);
routes.post("/login", validarRequisicao(schemaLogin), usuarioLogin);

routes.use(usuarioAutenticado);

routes.get("/usuario", users.detalharPerfilUsuario);
routes.put("/usuario", validarRequisicao(schemaUpdateUsuarios), users.atualizarPerfilUsuario);
routes.post("/produto", multer.single("produto_imagem"), validarRequisicao(schemaRegistrarProdutos), products.cadastrarProduto);
routes.get("/produto/:id", products.detalharProduto);
routes.get("/produto", products.listarProdutos);
routes.put("/produto/:id", multer.single('produto_imagem'), validarRequisicao(schemaRegistrarProdutos), products.editarProduto);
routes.delete("/produto/:id", products.deletarProduto)
routes.post("/cliente", validarRequisicao(schemaClient), cadastrarCliente);
routes.put("/cliente/:id", validarRequisicao(schemaClient), atualizarCliente);
routes.get("/cliente", listaClientes);
routes.get("/cliente/:id", detalharCliente);
routes.post("/pedido", cadastrarPedido)
routes.get("/pedido", listarPedidos);
routes.get("/pedido/:id", listarPedidosId);

module.exports = routes; 
