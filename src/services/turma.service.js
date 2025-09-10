import { NovaTurma, Turma } from '../entities/turma.js';

export class TurmaService {
    constructor(db) { this.db = db; }

    async list() {
        const res = await this.db.query('SELECT * FROM turmas');
        return res.rows.map(r => Turma.fromObj({
            id: r.id_turmas,
            nome: r.nome,
            anoEscolar: r.ano_escolar,
            quantidadeMaxima: r.quantidade_maxima,
            turno: r.turno,
            serie: r.serie,
            createdAt: r.created_at,
            updatedAt: r.updated_at
        }));
    }

    async getById(id) {
        const res = await this.db.query('SELECT * FROM turmas WHERE id_turmas = $1', [id]);
        if (res.rows.length === 0) return null;
        const r = res.rows[0];
        return Turma.fromObj({
            id: r.id_turmas,
            nome: r.nome,
            anoEscolar: r.ano_escolar,
            quantidadeMaxima: r.quantidade_maxima,
            turno: r.turno,
            serie: r.serie,
            createdAt: r.created_at,
            updatedAt: r.updated_at
        });
    }

    async create(novaTurma) {
        const res = await this.db.query(
            'INSERT INTO turmas (nome, ano_escolar, quantidade_maxima, turno, serie) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [novaTurma.nome, novaTurma.anoEscolar, novaTurma.quantidadeMaxima, novaTurma.turno, novaTurma.serie]
        );
        const r = res.rows[0];
        return Turma.fromObj({
            id: r.id_turmas,
            nome: r.nome,
            anoEscolar: r.ano_escolar,
            quantidadeMaxima: r.quantidade_maxima,
            turno: r.turno,
            serie: r.serie,
            createdAt: r.created_at,
            updatedAt: r.updated_at
        });
    }

    async update(id, novaTurma) {
        const res = await this.db.query(
            'UPDATE turmas SET nome = $1, ano_escolar = $2, quantidade_maxima = $3, turno = $4, serie = $5 WHERE id_turmas = $6 RETURNING *',
            [novaTurma.nome, novaTurma.anoEscolar, novaTurma.quantidadeMaxima, novaTurma.turno, novaTurma.serie, id]
        );
        if (res.rows.length === 0) throw new Error('Turma não encontrada');
        const r = res.rows[0];
        return Turma.fromObj({
            id: r.id_turmas,
            nome: r.nome,
            anoEscolar: r.ano_escolar,
            quantidadeMaxima: r.quantidade_maxima,
            turno: r.turno,
            serie: r.serie,
            createdAt: r.created_at,
            updatedAt: r.updated_at
        });
    }

    async delete(id) {
        const res = await this.db.query('DELETE FROM turmas WHERE id_turmas = $1', [id]);
        if (res.rowCount === 0) throw new Error('Turma não encontrada');
    }
}
