# API | Cliente&Negócio Satisfy

Sistema PDV - frente de caixa para otimização das operações de venda, facilitando o processo de pagamento e gerenciamento do estoque, além de registro de vendas e controle dos clientes.

<br>
<img align=center src="img/img-readme.png">

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
- Essa é a rota que será chamada quando o usuário quiser listar todas as categorias cadastradas.
 
<br>

```shell
http://localhost:3000/usuario
```
- Essa é a rota que será utilizada para cadastrar um novo usuário no sistema.
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

```shell
http://localhost:3000/login
```
- Essa é a rota que permite o usuário cadastrado realizar o login no sistema.

## Tecnologias usadas
- Javascript
- Node.js
- Express.js
- JSON
