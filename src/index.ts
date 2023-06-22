import express from "express";
import mysql from "mysql";

const app = express();

const database = mysql.createConnection({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const port = process.env.PORT || 4568;

// app.get("/init", (req, res) => {
//     const sqlQuery =
//         "CREATE TABLE IF NOT EXISTS pessoas_juridicas(id int AUTO_INCREMENT, firstname VARCHAR(50), lastname VARCHAR(50), email VARCHAR(50), PRIMARY KEY(id))";

//     database.query(sqlQuery, (err) => {
//         if (err) throw err;

//         res.send("Table created!");
//     });
// });

app.get("/ping", (req, res) => {
    return res.send("pong");
});

app.listen(port, () => {
    console.log(`Escutando na porta ${port}`);
});
