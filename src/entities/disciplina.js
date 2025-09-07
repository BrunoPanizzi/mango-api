export class NovaDisciplina {
    /**
     * @param {string} nome
     */
    constructor(nome) {
        this.nome = nome;
    }

    /**
     * @param {Object} obj
     * @returns {NovaDisciplina}
     */
    static fromObj(obj) {
        return new NovaDisciplina(
            obj.nome
        );
    }
}

export class Disciplina {
    /**
     * @param {number} id
     * @param {string} nome
     * @param {Date|string} [createdAt]
     * @param {Date|string} [updatedAt]
     */
    constructor(id, nome, createdAt, updatedAt) {
        this.id = id;
        this.nome = nome;
        this.createdAt = createdAt ? (createdAt instanceof Date ? createdAt : new Date(createdAt)) : undefined;
        this.updatedAt = updatedAt ? (updatedAt instanceof Date ? updatedAt : new Date(updatedAt)) : undefined;
    }

    /**
     * @param {Object} obj
     * @returns {Disciplina}
     */
    static fromObj(obj) {
        return new Disciplina(
            obj.id,
            obj.nome,
            obj.createdAt,
            obj.updatedAt
        );
    }
}