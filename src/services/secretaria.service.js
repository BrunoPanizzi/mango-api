import { NovoSecretaria, Secretaria } from '../entities/secretaria.js';
import { NovoUsuario, Usuario } from '../entities/usuario.js';

import { UsuarioService } from './usuario.service.js';

export class SecretariaService {
    /**
     * @param {import('../db/index.js').PoolClient} db
     * @param {UsuarioService} usuarioService
     */
    constructor(db, usuarioService) {
        this.db = db;
        this.usuarioService = usuarioService;
    }

    /**
     * Cria uma nova secretaria (cria usuário e secretaria)
     * @param {NovoSecretaria} novoSecretaria
     * @returns {Promise<Secretaria>}
     */
    async create(novoSecretaria) {
        // Cria usuário
        const usuario = await this.usuarioService.create(
            novoSecretaria.usuario
        );

        // Cria secretaria
        const res = await this.db.query(
            "INSERT INTO secretaria (usuario_id) VALUES ($1) RETURNING *",
            [usuario.id]
        );

        return Secretaria.fromRow(res.rows[0], usuario);
    }

    /**
     * Lista todas as secretarias
     * @returns {Promise<Secretaria[]>}
     */
    async list() {
        const res = await this.db.query(
            `SELECT s.*, u.id_usuarios, u.nome, u.email, u.hash_senha, u.tipo_usuario
             FROM secretaria s
             JOIN usuarios u ON s.usuario_id = u.id_usuarios`
        );
        return res.rows.map(row =>
            Secretaria.fromRow(row, Usuario.fromRow(row))
        );
    }

    /**
     * Busca uma secretaria pelo ID
     * @param {number} id
     * @returns {Promise<Secretaria|null>}
     */
    async getById(id) {
        const res = await this.db.query(
            `SELECT s.*, u.id_usuarios, u.nome, u.email, u.hash_senha, u.tipo_usuario
             FROM secretaria s
             JOIN usuarios u ON s.usuario_id = u.id_usuarios
             WHERE s.id_secretaria = $1`,
            [id]
        );
        if (res.rows.length === 0) return null;
        const row = res.rows[0];
        return Secretaria.fromRow(row, Usuario.fromRow(row));
    }

    /**
     * Atualiza dados da secretaria e do usuário
     * @param {number} id
     * @param {NovoSecretaria} novoSecretaria
     * @returns {Promise<Secretaria>}
     */
    async update(id, novoSecretaria) {
        // Busca secretaria para pegar usuario_id
        const res = await this.db.query(
            "SELECT usuario_id FROM secretaria WHERE id_secretaria = $1",
            [id]
        );
        if (res.rows.length === 0) throw new Error("Secretaria não encontrada");
        const usuario_id = res.rows[0].usuario_id;

        // Atualiza usuário
        const updatedUsuario = await this.usuarioService.update(
            usuario_id,
            novoSecretaria.usuario
        );

        // Atualiza secretaria (não há outros campos, apenas retorna)
        const secretariaRes = await this.db.query(
            "SELECT * FROM secretaria WHERE id_secretaria = $1",
            [id]
        );
        if (secretariaRes.rows.length === 0) throw new Error("Unreachable code");
        const row = secretariaRes.rows[0];

        return Secretaria.fromRow(row, updatedUsuario);
    }

    /**
     * Deleta uma secretaria e seu usuário
     * @param {number} id
     * @returns {Promise<void>}
     */
    async delete(id) {
        // Busca secretaria para pegar usuario_id
        const res = await this.db.query(
            "SELECT usuario_id FROM secretaria WHERE id_secretaria = $1",
            [id]
        );
        if (res.rows.length === 0) throw new Error("Secretaria não encontrada");
        const usuario_id = res.rows[0].usuario_id;

        // Deleta secretaria
        await this.db.query("DELETE FROM secretaria WHERE id_secretaria = $1", [id]);
        // Deleta usuário
        await this.db.query("DELETE FROM usuarios WHERE id_usuarios = $1", [usuario_id]);
    }
}
