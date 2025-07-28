import express from "express";
import { config } from "dotenv"

import { migrate } from "./db/migrate.js";
import { get_db } from "./db/index.js";

import { createUsuarioRouter } from "./controllers/usuario.controller.js";
import { createAlunoRouter } from "./controllers/aluno.controller.js";
import { createProfessorRouter } from "./controllers/professor.controller.js";
import { createSecretariaRouter } from "./controllers/secretaria.controller.js";
import { createAuthRouter } from "./controllers/auth.controller.js";
import { createMateriaRouter } from "./controllers/materia.controller.js";
import { HashingService } from "./services/hashing.service.js";

config()

const port = process.env.PORT;

const db = await get_db();
console.log("Conexão com o banco de dados estabelecida");
const hashingService = new HashingService(process.env.JWT_SECRET);

await migrate(db);

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Funcionando"
    })
})

app.use('/usuarios', createUsuarioRouter(db, hashingService));
app.use('/alunos', createAlunoRouter(db, hashingService));
app.use('/professores', createProfessorRouter(db, hashingService));
app.use('/secretarias', createSecretariaRouter(db, hashingService));
app.use('/auth', createAuthRouter(db, hashingService));
app.use('/materias', createMateriaRouter(db, hashingService));

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});