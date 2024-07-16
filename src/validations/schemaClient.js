const joi = require("joi");

const schemaClient = joi.object({
  nome: joi.string().required().messages({
    "any.required": "O campo nome é obrigatório.",
    "string.empty": "O campo nome é obrigatório.",
  }),

  email: joi.string().email().required().messages({
    "string.email": "O campo email precisa ter um formato válido.",
    "any.required": "O campo email é obrigatório.",
    "string.empty": "O campo email é obrigatório.",
  }),

  cpf: joi
    .string()
    .length(11)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "string.length": "O CPF precisa conter 11 digitos.",
      "string.empty": "O campo cpf é obrigatório.",
      "any.required": "O campo cpf é obrigatorio",
    }),

    cep: joi.string().length(8).messages({
      "string.length": "O CEP precisa conter 8 caracteres"
    }),
    rua: joi.string(),
    numero: joi.string(),
    bairro: joi.string(),
    cidade: joi.string(),
    estado: joi.string()
});


module.exports = schemaClient;
