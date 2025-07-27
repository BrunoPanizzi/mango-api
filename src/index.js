import express from "express";
import { config } from "dotenv"

import { migrate } from "./db/migrate.js";
import { get_db } from "./db/index.js";

import { createUsuarioRouter } from "./controllers/usuario.controller.js";
import { createAlunoRouter } from "./controllers/aluno.controller.js";
import { createProfessorRouter } from "./controllers/professor.controller.js";
import { createSecretariaRouter } from "./controllers/secretaria.controller.js";

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
app.use('/alunos', createAlunoRouter(db));
app.use('/professores', createProfessorRouter(db));
app.use('/secretarias', createSecretariaRouter(db));

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});