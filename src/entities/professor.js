import { Usuario, NovoUsuario } from './usuario.js';

// Representa um novo professor a ser criado (antes de existir no banco)
export class NovoProfessor {
    /**
     * @param {NovoUsuario} usuario
     * @param {string} disciplina_especialidade
     */
    constructor(usuario, disciplina_especialidade) {
        this.usuario = usuario;
        this.disciplina_especialidade = disciplina_especialidade;
    }

    /**
     * Cria uma instância de NovoProfessor a partir de um objeto
     * @param {Object} obj
     * @param {Object} obj.usuario
     * @param {string} obj.disciplina_especialidade
     * @returns {NovoProfessor}
     */
    static fromObj(obj) {
        return new NovoProfessor(
            NovoUsuario.fromObj(obj.usuario),
            obj.disciplina_especialidade
        );
    }
}

// Representa um professor existente no banco
export class Professor {
    /**
     * @param {number} id
     * @param {Usuario} usuario
     * @param {string} disciplina_especialidade
     */
    constructor(id, usuario, disciplina_especialidade) {
        this.id = id;
        this.usuario = usuario;
        this.disciplina_especialidade = disciplina_especialidade;
    }

    /**
     * Cria uma instância de Professor a partir de uma linha do banco de dados
     * 
     * @param {Object} row
     * @param {Usuario} usuario
     * @returns {Professor}
     */
    static fromRow(row, usuario) {
        return Professor.fromObj({
            id: row.id_professores,
            disciplina_especialidade: row.disciplina_especialidade,
            usuario,
        });
    }

    /**
     * Cria uma instância de Professor a partir de um objeto
     * @param {Object} obj
     * @param {number} obj.id
     * @param {Object} obj.usuario
     * @param {string} obj.disciplina_especialidade
     * @returns {Professor}
     */
    static fromObj(obj) {
        return new Professor(
            obj.id,
            Usuario.fromObj(obj.usuario),
            obj.disciplina_especialidade
        );
    }
}
