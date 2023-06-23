import express, { Request, Response, Express } from "express";
import bodyParser from "body-parser";
import mysql, { Connection, MysqlError } from "mysql";
import { cpf, cnpj } from "cpf-cnpj-validator";
import { pjSchema } from "schemas";
import { formatCEP, formatPhone } from "formatters";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json";
require("dotenv").config();

const app: Express = express();
const port: number = Number(process.env.PORT) || 4568;

app.use(bodyParser.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const database: Connection = mysql.createConnection({
    user: "root",
    password: process.env.MYSQLDB_PASSWORD,
    database: process.env.MYSQLDB_DATABASE,
    host: "localhost",
    port: 3306,
});

database.connect((err: MysqlError) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }

    console.log("Database connected!");
});

const sqlQueryCreateTable =
    "CREATE TABLE IF NOT EXISTS pessoas_juridicas(" +
    "id INT AUTO_INCREMENT PRIMARY KEY," +
    "cnpj VARCHAR(20) NOT NULL," +
    "cpf VARCHAR(20) NOT NULL," +
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

const sqlQuerySelectAll = "SELECT * FROM pessoas_juridicas";

const sqlQueryInsert = "INSERT INTO pessoas_juridicas SET ?";

app.get("/list", (req: Request, res: Response) => {
    database.query(
        sqlQuerySelectAll,
        (err: mysql.MysqlError | null, result: any) => {
            if (err) {
                console.error(err);
                res.status(500).send("Internal Server Error");
                return;
            }

            res.send({ pessoas_juridicas: result });
        }
    );
});

app.post("/register/pj", (req: Request, res: Response) => {
    const validationResult = pjSchema.validate(req.body);

    if (validationResult.error) {
        res.status(400).json(validationResult.error.details);
        return;
    }

    const pessoaJuridica: {
        cnpj: string;
        cpf: string;
        nome: string;
        celular: string;
        telefone: string;
        email: string;
        cep: string;
        endereco: string;
        numero: number;
        complemento?: string;
        cidade: string;
        bairro: string;
        estado: string;
    } = {
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

    database.query(
        sqlQueryInsert,
        pessoaJuridica,
        (err: mysql.MysqlError | null) => {
            if (err) {
                console.error(err);
                res.status(500).send("Internal Server Error");
                return;
            }

            res.send("Cadastro realizado!");
        }
    );
});

const server = app.listen(port, () => {
    database.query(sqlQueryCreateTable, (err: mysql.MysqlError | null) => {
        if (err) {
            console.error(err);
            server.close(() => {
                process.exit(1);
            });
            return;
        }

        console.log("Table initialized!");
        console.log(`Listening on port ${port}`);
    });
});

process.on("SIGINT", () => {
    server.close(() => {
        database.end((err: mysql.MysqlError | undefined) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            process.exit(0);
        });
    });
});
