import { format } from 'date-fns'

import { Usuario, NovoUsuario } from './usuario.js';

// Representa um novo aluno a ser criado (antes de existir no banco)
export class NovoAluno {
    /**
     * @param {NovoUsuario} usuario
     * @param {string|null} data_nascimento
     * @param {string|null} responsavel_nome
     * @param {string|null} nome_pai
     * @param {string|null} nome_mae
     * @param {string|null} profissao_pai
     * @param {string|null} profissao_mae
     * @param {string|null} alergias
     * @param {string|null} telefone_pai
     * @param {string|null} telefone_mae
     * @param {string|null} email_pai
     * @param {string|null} email_mae
     * @param {number|null} idade
     * @param {string|null} religiao
     */
    constructor(
        usuario,
        data_nascimento = null,
        responsavel_nome = null,
        nome_pai = null,
        nome_mae = null,
        profissao_pai = null,
        profissao_mae = null,
        alergias = null,
        telefone_pai = null,
        telefone_mae = null,
        email_pai = null,
        email_mae = null,
        idade = null,
        religiao = null
    ) {
        this.usuario = usuario;

        if (!data_nascimento?.match(/^\d{4}-\d{2}-\d{2}$/)) {
            this.data_nascimento = null; // Ensure date is in correct format
        } else {
            this.data_nascimento = data_nascimento
        }
        this.responsavel_nome = responsavel_nome;
        this.nome_pai = nome_pai;
        this.nome_mae = nome_mae;
        this.profissao_pai = profissao_pai;
        this.profissao_mae = profissao_mae;
        this.alergias = alergias;
        this.telefone_pai = telefone_pai;
        this.telefone_mae = telefone_mae;
        this.email_pai = email_pai;
        this.email_mae = email_mae;
        this.idade = idade;
        this.religiao = religiao;
    }

    /**
     * Cria uma instância de NovoAluno a partir de um objeto
     * @param {{
     *   usuario: Object,
     *   data_nascimento?: string|null,
     *   responsavel_nome?: string|null,
     *   nome_pai?: string|null,
     *   nome_mae?: string|null,
     *   profissao_pai?: string|null,
     *   profissao_mae?: string|null,
     *   alergias?: string|null,
     *   telefone_pai?: string|null,
     *   telefone_mae?: string|null,
     *   email_pai?: string|null,
     *   email_mae?: string|null,
     *   idade?: number|null,
     *   religiao?: string|null
     * }} obj
     * @returns {NovoAluno}
     */
    static fromObj(obj) {
        return new NovoAluno(
            NovoUsuario.fromObj(obj.usuario),
            obj.data_nascimento ?? null,
            obj.responsavel_nome ?? null,
            obj.nome_pai ?? null,
            obj.nome_mae ?? null,
            obj.profissao_pai ?? null,
            obj.profissao_mae ?? null,
            obj.alergias ?? null,
            obj.telefone_pai ?? null,
            obj.telefone_mae ?? null,
            obj.email_pai ?? null,
            obj.email_mae ?? null,
            obj.idade ?? null,
            obj.religiao ?? null
        );
    }
}

// Representa um aluno existente no banco
export class Aluno {
    /**
     * @param {number} id
     * @param {Usuario} usuario
     * @param {string|null} data_nascimento
     * @param {string|null} responsavel_nome
     * @param {string|null} nome_pai
     * @param {string|null} nome_mae
     * @param {string|null} profissao_pai
     * @param {string|null} profissao_mae
     * @param {string|null} alergias
     * @param {string|null} telefone_pai
     * @param {string|null} telefone_mae
     * @param {string|null} email_pai
     * @param {string|null} email_mae
     * @param {number|null} idade
     * @param {string|null} religiao
     */
    constructor(
        id,
        usuario,
        data_nascimento = null,
        responsavel_nome = null,
        nome_pai = null,
        nome_mae = null,
        profissao_pai = null,
        profissao_mae = null,
        alergias = null,
        telefone_pai = null,
        telefone_mae = null,
        email_pai = null,
        email_mae = null,
        idade = null,
        religiao = null
    ) {
        this.id = id;
        this.usuario = usuario;
        if (!data_nascimento?.match(/^\d{4}-\d{2}-\d{2}$/)) {
            this.data_nascimento = null
        } else {
            this.data_nascimento = data_nascimento
        }
        this.responsavel_nome = responsavel_nome;
        this.nome_pai = nome_pai;
        this.nome_mae = nome_mae;
        this.profissao_pai = profissao_pai;
        this.profissao_mae = profissao_mae;
        this.alergias = alergias;
        this.telefone_pai = telefone_pai;
        this.telefone_mae = telefone_mae;
        this.email_pai = email_pai;
        this.email_mae = email_mae;
        this.idade = idade;
        this.religiao = religiao;
    }

    /**
     * Cria uma instância de Aluno a partir de uma linha do banco de dados
     * @param {Object} row
     * @param {Usuario} usuario
     * @returns {Aluno}
     */
    static fromRow(row, usuario) {
        const data_nascimento = row.data_nascimento ? format(new Date(row.data_nascimento), 'yyyy-MM-dd') : null
        return Aluno.fromObj({
            id: row.id_alunos,
            usuario,
            data_nascimento: data_nascimento,
            responsavel_nome: row.responsavel_nome,
            nome_pai: row.nome_pai,
            nome_mae: row.nome_mae,
            profissao_pai: row.profissao_pai,
            profissao_mae: row.profissao_mae,
            alergias: row.alergias,
            telefone_pai: row.telefone_pai,
            telefone_mae: row.telefone_mae,
            email_pai: row.email_pai,
            email_mae: row.email_mae,
            idade: row.idade,
            religiao: row.religiao
        });
    }

    /**
     * Cria uma instância de Aluno a partir de um objeto
     * @param {{
     *   id: number,
     *   usuario: Object,
     *   data_nascimento?: string|string|null,
     *   responsavel_nome?: string|null,
     *   nome_pai?: string|null,
     *   nome_mae?: string|null,
     *   profissao_pai?: string|null,
     *   profissao_mae?: string|null,
     *   alergias?: string|null,
     *   telefone_pai?: string|null,
     *   telefone_mae?: string|null,
     *   email_pai?: string|null,
     *   email_mae?: string|null,
     *   idade?: number|null,
     *   religiao?: string|null
     * }} obj
     * @returns {Aluno}
     */
    static fromObj(obj) {
        return new Aluno(
            obj.id,
            Usuario.fromObj(obj.usuario),
            obj.data_nascimento ?? null,
            obj.responsavel_nome ?? null,
            obj.nome_pai ?? null,
            obj.nome_mae ?? null,
            obj.profissao_pai ?? null,
            obj.profissao_mae ?? null,
            obj.alergias ?? null,
            obj.telefone_pai ?? null,
            obj.telefone_mae ?? null,
            obj.email_pai ?? null,
            obj.email_mae ?? null,
            obj.idade ?? null,
            obj.religiao ?? null
        );
    }
}
