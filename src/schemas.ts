import validator from "cpf-cnpj-validator"; // Package that validates the CPF/CNPJ, found at https://www.npmjs.com/package/cpf-cnpj-validator

// Using Joi to validate fields using schemas, and extending to use the validator for CPF/CNPJ
const Joi = require("joi").extend(validator);

// Validates CEP
const cepSchema = Joi.string()
    .custom((value: string, helper: any) => {
        var regex1 = /^[0-9]{5}-[0-9]{3}$/; // Format xxxxx-xxx
        var regex2 = /^[0-9]{8}$/; // Format xxxxxxxx
        if (!regex1.test(value) && !regex2.test(value))
            return helper.message(
                "CEP inválido! Formatos aceitos: 66115-092 ou 66115092"
            );
        return true;
    })
    .required();

// Validates phone numbers
const cellSchema = Joi.string()
    .custom((value: string, helper: any) => {
        var regex1 = /^\([0-9]{2}\) [0-9]{5}-[0-9]{4}$/; // Format (xx) xxxxx-xxxx
        var regex2 = /^[0-9]{11}$/; // Format xxxxxxxxxxx
        if (!regex1.test(value) && !regex2.test(value))
            return helper.message(
                "Celular inválido! Formatos aceitos: (61) 98831-7667 ou 61988317667"
            );
        return true;
    })
    .required();

const phoneSchema = Joi.string()
    .custom((value: string, helper: any) => {
        var regex1 = /^\([0-9]{2}\) [0-9]{4}-[0-9]{4}$/; // Format (xx) xxxx-xxxx
        var regex2 = /^[0-9]{10}$/; // Format xxxxxxxxxx
        if (!regex1.test(value) && !regex2.test(value))
            return helper.message(
                "Telefone inválido! Formatos aceitos: (81) 3771-2636 ou 8137712636"
            );
        return true;
    })
    .required();

// Default string schema
const stringSchema = Joi.string().required();

// Body schema
export const pjSchema = Joi.object().options({ abortEarly: false }).keys({
    cnpj: Joi.document().cnpj().required(),
    cpf: Joi.document().cpf().required(),
    nome: stringSchema,
    celular: cellSchema,
    telefone: phoneSchema,
    email: Joi.string().email().required(),
    cep: cepSchema,
    endereco: stringSchema,
    numero: Joi.number().required(),
    complemento: Joi.string().optional(),
    cidade: stringSchema,
    bairro: stringSchema,
    estado: stringSchema,
});
