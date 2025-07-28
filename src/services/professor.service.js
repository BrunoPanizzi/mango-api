import { NovoProfessor, Professor } from '../entities/professor.js';
import { NovoUsuario, Usuario } from '../entities/usuario.js';

import { UsuarioService } from './usuario.service.js';

export class ProfessorService {
    /**
     * @param {import('../db/index.js').PoolClient}
     * @param {UsuarioService} usuarioService
     */
    constructor(db, usuarioService) {
        this.db = db;
        this.usuarioService = usuarioService;
    }

    /**
     * Lista todos os professores
     * @returns {Promise<Professor[]>}
     */
    async list() {
        const res = await this.db.query(
            `SELECT p.*, u.id_usuarios, u.nome, u.email, u.hash_senha, u.tipo_usuario
             FROM professores p
             JOIN usuarios u ON p.usuario_id = u.id_usuarios`
        );

        return res.rows.map(row => 
            Professor.fromRow(row, Usuario.fromRow(row))
        );
    }

    /**
     * Busca um professor pelo ID
     * @param {number} id
     * @returns {Promise<Professor|null>}
     */
    async getById(id) {
        const res = await this.db.query(
            `SELECT p.*, u.id_usuarios, u.nome, u.email, u.hash_senha, u.tipo_usuario
             FROM professores p
             JOIN usuarios u ON p.usuario_id = u.id_usuarios
             WHERE p.id_professores = $1`,
            [id]
        );

        if (res.rows.length === 0) return null;

        const row = res.rows[0];

        return Professor.fromRow(row, Usuario.fromRow(row));
   }

    /**
     * Busca um professor pelo usuario_id
     * @param {number} usuarioId
     * @returns {Promise<Professor|null>}
     */
    async getByUsuarioId(usuarioId) {
        const res = await this.db.query(
            `SELECT p.*, u.id_usuarios, u.nome, u.email, u.hash_senha, u.tipo_usuario
             FROM professores p
             JOIN usuarios u ON p.usuario_id = u.id_usuarios
             WHERE p.usuario_id = $1`,
            [usuarioId]
        );
        if (res.rows.length === 0) return null;
        const row = res.rows[0];
        return Professor.fromRow(row, Usuario.fromRow(row));
    }

    /**
     * Cria um novo professor (cria usuário e professor)
     * @param {NovoProfessor} novoProfessor
     * @returns {Promise<Professor>}
     */
    async create(novoProfessor) {
        // Cria usuário
        const usuario = await this.usuarioService.create(
            novoProfessor.usuario
        );

        // Cria professor
        const res = await this.db.query(
            "INSERT INTO professores (usuario_id, disciplina_especialidade) VALUES ($1, $2) RETURNING professores.*",
            [usuario.id, novoProfessor.disciplina_especialidade]
        );

        return Professor.fromRow(res.rows[0], usuario);
    }

    /**
     * Atualiza dados do professor e do usuário
     * @param {number} id
     * @param {NovoProfessor} novoProfessor
     * @returns {Promise<Professor>}
     */
    async update(id, novoProfessor) {
        // Busca professor para pegar usuario_id
        const profRes = await this.db.query(
            "SELECT usuario_id FROM professores WHERE id_professores = $1",
            [id]
        );

        if (profRes.rows.length === 0) throw new Error("Professor não encontrado");
        
        const usuario_id = profRes.rows[0].usuario_id;

        // Atualiza usuário
        const updatedUsuario = await this.usuarioService.update(
            usuario_id,
            novoProfessor.usuario
        );

        // Atualiza professor
        const updateProfRes = await this.db.query(
            "UPDATE professores SET disciplina_especialidade = $1 WHERE id_professores = $2 RETURNING *",
            [novoProfessor.disciplina_especialidade, id]
        );

        if (updateProfRes.rows.length === 0) throw new Error("Unreachable code");
        const row = updateProfRes.rows[0];
        
        return Professor.fromRow(row, updatedUsuario);
    }

    /**
     * Deleta um professor e seu usuário
     * @param {number} id
     * @returns {Promise<void>}
     */
    async delete(id) {
        // Busca professor para pegar usuario_id
        const profRes = await this.db.query(
            "SELECT * FROM professores WHERE id_professores = $1",
            [id]
        );
        if (profRes.rows.length === 0) throw new Error("Professor não encontrado");
        const usuario_id = profRes.rows[0].usuario_id;

        // Deleta professor
        await this.db.query("DELETE FROM professores WHERE id_professores = $1", [id]);
        // Deleta usuário
        await this.db.query("DELETE FROM usuarios WHERE id_usuarios = $1", [usuario_id]);
    }
}
