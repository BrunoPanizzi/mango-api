import { ProfessorService } from '../services/professor.service.js'
import { SecretariaService } from '../services/secretaria.service.js'
import { UsuarioService } from '../services/usuario.service.js';


/**
 * Função utilizada para popular o banco de dados com dados iniciais
 *
 * @param {import('pg').Pool} db
 * @param {import('../services/hashing.service.js').HashingService} hashingService
 * @returns {Promise<void>}
 */
export async function seed(db, hashingService) {
    if (process.env.SEED_DB !== "true") {
        console.log("Seeding desativado");
        return;
    }

    const usuarioService = new UsuarioService(db, hashingService);

    const professorService = new ProfessorService(db, usuarioService);
    const secretariaService = new SecretariaService(db, usuarioService);

    const professor = await professorService.create({
        usuario: {
            nome: "Admin Professor",
            email: "admin.professor@example.com",
            senha: "senha123",
            tipo_usuario: "professor"
        },
        disciplina_especialidade: "Matemática"
    });

    const secretaria = await secretariaService.create({
        usuario: {
            nome: "Admin Secretaria",
            email: "admin.secretaria@example.com",
            senha: "senha123",
            tipo_usuario: "secretaria"
        }
    });

    console.log("Seeding concluído");
    console.log("Professor criado:", professor);
    console.log("Secretaria criada:", secretaria);
}