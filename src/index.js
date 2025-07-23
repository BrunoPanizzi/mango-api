import express from "express";
import { config } from "dotenv"

import { migrate } from "./db/migrate.js";
import { get_db } from "./db/index.js";

import { createUsuarioRouter } from "./controllers/usuario.controller.js";

config()

const port = process.env.PORT;

const db = await get_db();
console.log("Conexão com o banco de dados estabelecida");

await migrate(db);

const app = express();

app.get("/", (req, res) => {
    res.json({
        message: "Funcionando"
    })
})

app.use('/usuarios', createUsuarioRouter(db));

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});