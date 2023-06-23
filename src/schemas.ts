import validator from "cpf-cnpj-validator";

// Extend Joi with CPF/CNPJ validator
const Joi = require("joi").extend(validator);

// Common validation messages
const validationMessages = {
    cep: "CEP inválido! Formatos aceitos: 66115-092 ou 66115092",
    celular:
        "Celular inválido! Formatos aceitos: (61) 98831-7667 ou 61988317667",
    telefone:
        "Telefone inválido! Formatos aceitos: (81) 3771-2636 ou 8137712636",
};

// Validates CEP
const cepSchema = Joi.string()
    .pattern(/^(?:\d{5}-\d{3}|\d{8})$/) // Format: xxxxx-xxx or xxxxxxxx
    .required()
    .messages({ "string.pattern.base": validationMessages.cep });

// Validates phone numbers
const cellSchema = Joi.string()
    .pattern(/^(?:\(\d{2}\) \d{5}-\d{4}|\d{11})$/) // Format: (xx) xxxxx-xxxx or xxxxxxxxxxx
    .required()
    .messages({ "string.pattern.base": validationMessages.celular });

const phoneSchema = Joi.string()
    .pattern(/^(?:\(\d{2}\) \d{4}-\d{4}|\d{10})$/) // Format: (xx) xxxx-xxxx or xxxxxxxxxx
    .required()
    .messages({ "string.pattern.base": validationMessages.telefone });

// Common string schema
const stringSchema = Joi.string().required();

// Body schema
export const pjSchema = Joi.object({
    cnpj: Joi.document().cnpj().required(),
    cpf: Joi.document().cpf().required(),
    nome: stringSchema,
    celular: cellSchema,
    telefone: phoneSchema,
    email: Joi.string().email().required(),
    cep: cepSchema,
    endereco: stringSchema,
    numero: Joi.number().required(),
    complemento: Joi.string().allow(null).optional(),
    cidade: stringSchema,
    bairro: stringSchema,
    estado: stringSchema,
}).options({ abortEarly: false });
