import { Request, Response } from "express";
import validator from "cpf-cnpj-validator";

const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const Joi = require("joi").extend(validator);

const app = express();
app.use(bodyParser.json());

require("dotenv").config();

const pjSchema = Joi.object().options({ abortEarly: false }).keys({
    cnpj: Joi.document().cnpj().required(),
    cpf: Joi.document().cpf().required(),
    nome: Joi.string().required(),
    celular: Joi.string().required(),
    telefone: Joi.string().required(),
    email: Joi.string().email().required(),
    cep: Joi.string().required(),
    endereco: Joi.string().required(),
    numero: Joi.number().required(),
    complemento: Joi.string().required(),
    cidade: Joi.string().required(),
    bairro: Joi.string().required(),
    estado: Joi.string().required(),
});

const database = mysql.createConnection({
    user: "root",
    password: process.env.MYSQLDB_PASSWORD,
    database: process.env.MYSQLDB_DATABASE,
    host: "localhost",
    port: 3306,
});

database.connect();

const port = process.env.PORT || 4568;

app.get("/init", (req: Request, res: Response) => {
    const sqlQuery =
        "CREATE TABLE IF NOT EXISTS pessoas_juridicas(" +
        "id int AUTO_INCREMENT" +
        "cnpj VARCHAR(14) NOT NULL" +
        "cpf VARCHAR(11) NOT NULL" +
        "nome VARCHAR(255) NOT NULL" +
        "celular VARCHAR(20) NOT NULL" +
        "telefone VARCHAR(20) NOT NULL" +
        "email VARCHAR(100) NOT NULL" +
        "cep VARCHAR(9) NOT NULL" +
        "endereco VARCHAR(255) NOT NULL" +
        "numero INT(10) NOT NULL" +
        "complemento VARCHAR(100) NOT NULL" +
        "cidade VARCHAR(100) NOT NULL" +
        "bairro VARCHAR(100) NOT NULL" +
        "estado VARCHAR(100) NOT NULL" +
        "PRIMARY KEY(id))";

    database.query(sqlQuery, (err: number) => {
        if (err) throw err;

        res.send("Table created!");
    });
});

app.post("/register/pj", (req: Request, res: Response) => {
    if (pjSchema.validate(req.body).error)
        res.send(pjSchema.validate(req.body).error.details);
    else res.send("OK!");
});

app.listen(port, () => {
    console.log(`Escutando na porta ${port}`);
});
