const joi = require("joi");

const schemaRegistrarProdutos = joi.object({
    descricao: joi.string().required().messages({
		'any.required': 'O campo descricao é obrigatório',
		'string.empty': 'O campo descricao é obrigatório',
	}),

	quantidade_estoque: joi.number().positive().required().messages({
        'any.required': 'O campo quantidade_estoque é obrigatório',
		'number.positive': 'O campo quantidade_estoque precisa ser um número positivo',
		'number.base': 'O campo quantidade_estoque precisa ser um número',
	}),

	valor: joi.number().positive().required().messages({
        'any.required': 'O campo valor é obrigatório',
		'number.positive': 'O campo valor precisa ser um número positivo',
		'number.base': 'O campo valor precisa ser um número',
	}),
    
    categoria_id: joi.number().positive().required().messages({
        'any.required': 'O campo categoria_id é obrigatório',
		'number.positive': 'O campo categoria_id precisa ser um número positivo',
		'number.base': 'O campo categoria_id precisa ser um número',
	}),
    

})

module.exports = schemaRegistrarProdutos