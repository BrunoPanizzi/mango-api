import { NovoMateria, Materia } from '../entities/materia.js';

export class MateriaService {
    /**
     * @param {import('../db/index.js').PoolClient} db
     */
    constructor(db) {
        this.db = db;
    }

    /**
     * Lista todas as matérias
     * @returns {Promise<Materia[]>}
     */
    async list() {
        const res = await this.db.query("SELECT * FROM materias");
        return res.rows.map(row => Materia.fromRow(row));
    }

    /**
     * Busca uma matéria pelo ID
     * @param {number} id
     * @returns {Promise<Materia|null>}
     */
    async getById(id) {
        const res = await this.db.query("SELECT * FROM materias WHERE id_materias = $1", [id]);
        if (res.rows.length === 0) return null;
        return Materia.fromRow(res.rows[0]);
    }

    /**
     * Cria uma nova matéria
     * @param {NovoMateria} novoMateria
     * @returns {Promise<Materia>}
     */
    async create(novoMateria) {
        const res = await this.db.query(
            "INSERT INTO materias (nome) VALUES ($1) RETURNING *",
            [novoMateria.nome]
        );
        return Materia.fromRow(res.rows[0]);
    }

    /**
     * Atualiza uma matéria existente
     * @param {number} id
     * @param {NovoMateria} novoMateria
     * @returns {Promise<Materia>}
     */
    async update(id, novoMateria) {
        const res = await this.db.query(
            "UPDATE materias SET nome = $1 WHERE id_materias = $2 RETURNING *",
            [novoMateria.nome, id]
        );
        if (res.rows.length === 0) throw new Error("Matéria não encontrada");
        return Materia.fromRow(res.rows[0]);
    }

    /**
     * Deleta uma matéria
     * @param {number} id
     * @returns {Promise<void>}
     */
    async delete(id) {
        const res = await this.db.query("DELETE FROM materias WHERE id_materias = $1", [id]);
        if (res.rowCount === 0) throw new Error("Matéria não encontrada");
    }
}
