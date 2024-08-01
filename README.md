# API | Cliente&Negócio Satisfy

Uma API RESTful de um Sistema PDV (frente de caixa) para otimização das operações de venda, facilitando o processo de pagamento e gerenciamento do estoque, além de registro de vendas e controle dos clientes e envio de email para pedidos realizados.<br>
> **[Real-Time Testing](https://api-cn-satisfy.onrender.com/api-docs/#/)**


<br>
<img align=center src="banner-repository-c&n-satisfy2.png">

## Como rodar

Para rodar o projeto localmente, você precisa:

- _Instalar as dependências_

```shell
npm install
```

- _Iniciar o projeto com:_

```shell
npm run dev
```

## _Rotas usáveis_ 

O servidor será iniciado na porta 3000 e você poderá acessá-lo em:

 <br>

 ```shell
 http://localhost:3000/categoria
```
`GET` _Essa é a rota que será chamada quando o usuário quiser listar todas as categorias cadastradas._

<br>
<br>

```shell
http://localhost:3000/usuario
```
`POST` _Essa é a rota que será utilizada para cadastrar um novo usuário no sistema._ <br>
`GET` _Essa é a rota que permite o usuário logado a visualizar os dados do seu próprio perfil, de acordo com a validação do token de autenticação._<br>
`PUT` _Essa é a rota que permite o usuário logado atualizar informações de seu próprio cadastro, de acordo com a validação do token de autenticação._<br>
<details>
<summary><b>Exemplo de Requisição json</b></summary>
<br>
 
```javascript
{
"nome": "José",
    "email": "jose@email.com",
    "senha": "jose"
}
```
</details>

<br>
<br>

```shell
http://localhost:3000/login
```
`POST` _Essa é a rota que permite o usuário cadastrado realizar o login no sistema._

<br>
<br>

```shell
http://localhost:3000/produto
```
`POST` _Essa é a rota que permite o usuário logado cadastrar um novo produto no sistema._ <br>
`PUT` `/produto/:id` _Essa é a rota que permite o usuário logado a atualizar as informações de um produto cadastrado._<br>
`GET` _Essa é a rota que será chamada quando o usuário logado quiser listar todos os produtos cadastrados._<br>
`GET` `/produto/:id` _Essa é a rota que permite o usuário logado obter um de seus produtos cadastrados._<br>
`DELETE` `/produto/:id` _Essa é a rota que será chamada quando o usuário logado quiser excluir um de seus produtos cadastrados._
<details>
<summary><b>Exemplo de Requisição json</b></summary>
<br>
 
> OBS: Utilizar a requisição multipart/form-data.

```javascript
// GET /produto?categoria_id=1
// Filtrar os produto por categoria, caso seja informado o parâmetro do tipo query categoria_id.


// POST /produto
{
 "descricao": "Placa de Video NV RTX4060TI 8GB",
 "quantidade_estoque": 15,
 "valor": 267500,
 "categoria_id": 1,
 "produto_imagem": (Arquivo de imagem)
}
```
</details>
<br>
<br>

```shell
http://localhost:3000/cliente
```
`POST` _Essa é a rota que permite usuário logado cadastrar um novo cliente no sistema._ <br>
`PUT` `/produto/:id` _Essa é a rota que permite o usuário realizar atualização de um cliente cadastrado._<br>
`GET` _Essa é a rota que será chamada quando o usuário logado quiser listar todos os clientes cadastrados._<br>
`GET` `/produto/:id` _Essa é a rota que será chamada quando o usuário logado quiser obter um de seus clientes cadastrados._<br>
<details>
<summary><b>Exemplo de Requisição json</b></summary>
<br>

```javascript
{
	"nome": "João Marcos",
	"email": "joão@email.com",
	"cpf": "02354799426",
	"cep": "01310000",
	"rua": "Avenida Paulista",
	"numero": "610",
	"bairro": "Bela Vista",
	"cidade": "São Paulo",
	"estado": "SP"
}
```
</details>
<br>
<br>

```shell
http://localhost:3000/pedido
```
`POST` _Essa é a rota que será utilizada para cadastrar um novo pedido no sistema._ <br>
`GET` _Essa é a rota que será chamada quando o usuário logado quiser listar todos os pedidos cadastrados._<br>
<details>
<summary><b>Exemplo de Requisição json</b></summary>
<br>
 
```javascript

//GET /pedido?cliente__id=1
// Caso seja informado o parâmetro do tipo query `cliente__id`, será listado apenas os pedidos do cliente específico.

{
    "cliente_id": 1,
    "observacao": "Em caso de ausência recomendo deixar com algum vizinho",
    "pedido_produtos": [
        {
            "produto_id": 1,
            "quantidade_produto": 10
        },
        {
            "produto_id": 2,
            "quantidade_produto": 20
        }
    ]
}
```
</details>



## _Middlewares_
- authentication<br>
  _Middleware responsável em validar o token de autenticação do usuário logado, através do JWT token enviado no header da requisição, caso algo de errado aconteça, um erro 401 aparecerá, indicando usuário não autenticado._
- validatRequest<br>
  _Middleware responsável em validar os dados da requisição antes que eles sejam processados pela aplicação, Se a validação falhar, ele retorna um erro 400 com a mensagem. Se a validação for bem-sucedida, ele chama next() para continuar para o próximo middleware ou rota._


## _Tecnologias usadas_
- Javascript
- Node.js
- Express.js
- JSON
