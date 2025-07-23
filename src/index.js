import express from "express";
import { config } from "dotenv"

import { selectUsuarios } from "./db/index.js";
import { migrate } from "./db/migrate.js";

config()

const port = process.env.PORT;

if (process.env.MIGRATE_DB === "true") {
    await migrate();
}

const app = express();

app.get("/", (req, res) => {
    res.json({
        message: "Funcionando"
    })
})

app.get("/alunos", async (req, res) => {
    const usuarios = await selectUsuarios();
    res.json(usuarios);
})

app.listen(port);

console.log("Back rodando");