// Imports
import { Request, Response } from "express";
import express from "express";
import mysql from "mysql";
import bodyParser from "body-parser";
import { cpf, cnpj } from "cpf-cnpj-validator"; // Package that validates the CPF/CNPJ, found at https://www.npmjs.com/package/cpf-cnpj-validator
import { pjSchema } from "schemas"; // Body schema
import { formatCEP, formatPhone } from "formatters"; // Formatters for CEP and phones for storing in database

// Define app and use JSON body parser
const app = express();
app.use(bodyParser.json());

// Swagger UI
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Setting dotenv
require("dotenv").config();

// Database connection

const database = mysql.createConnection({
    user: "root",
    password: process.env.MYSQLDB_PASSWORD,
    database: process.env.MYSQLDB_DATABASE,
    host: "localhost",
    port: 3306,
});

database.connect();

// App port and routes

const port = process.env.PORT || 4568;

app.get("/init", (req: Request, res: Response) => {
    const sqlQuery =
        "CREATE TABLE IF NOT EXISTS pessoas_juridicas(" +
        "id INT AUTO_INCREMENT PRIMARY KEY," +
        "cnpj VARCHAR(14) NOT NULL," +
        "cpf VARCHAR(11) NOT NULL," +
        "nome VARCHAR(255) NOT NULL," +
        "celular VARCHAR(20) NOT NULL," +
        "telefone VARCHAR(20) NOT NULL," +
        "email VARCHAR(100) NOT NULL," +
        "cep VARCHAR(9) NOT NULL," +
        "endereco VARCHAR(255) NOT NULL," +
        "numero INT(10) NOT NULL," +
        "complemento VARCHAR(100)," +
        "cidade VARCHAR(100) NOT NULL," +
        "bairro VARCHAR(100) NOT NULL," +
        "estado VARCHAR(100) NOT NULL)";

    database.query(sqlQuery, (err: number) => {
        if (err) throw err;

        res.send("Tabela inicializada!");
    });
});

app.get("/list", (req: Request, res: Response) => {
    const sqlQuery = "SELECT * FROM pessoas_juridicas";

    database.query(sqlQuery, (err, result) => {
        if (err) throw err;

        res.send({ pessoas_juridicas: result });
    });
});

app.post("/register/pj", (req: Request, res: Response) => {
    if (pjSchema.validate(req.body).error)
        res.status(400).json(pjSchema.validate(req.body).error.details);
    else {
        const pessoaJuridica = {
            cnpj: cnpj.format(req.body.cnpj),
            cpf: cpf.format(req.body.cpf),
            nome: req.body.nome,
            celular: formatPhone(req.body.celular),
            telefone: formatPhone(req.body.telefone),
            email: req.body.email,
            cep: formatCEP(req.body.cep),
            endereco: req.body.endereco,
            numero: req.body.numero,
            complemento: req.body.complemento,
            cidade: req.body.cidade,
            bairro: req.body.bairro,
            estado: req.body.estado,
        };

        const sqlQuery = "INSERT INTO pessoas_juridicas SET ?";

        database.query(sqlQuery, pessoaJuridica, (err, row) => {
            if (err) throw err;

            res.send("Cadastro realizado!");
        });
    }
});

app.listen(port, () => {
    console.log(`Escutando na porta ${port}`);
});
