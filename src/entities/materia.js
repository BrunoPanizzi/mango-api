export class NovoMateria {
    /**
     * @param {string} nome
     */
    constructor(nome) {
        this.nome = nome;
    }

    /**
     * Cria uma instância de NovoMateria a partir de um objeto
     * @param {Object} obj
     * @returns {NovoMateria}
     */
    static fromObj(obj) {
        return new NovoMateria(obj.nome);
    }
}

export class Materia {
    /**
     * @param {number} id
     * @param {string} nome
     */
    constructor(id, nome) {
        this.id = id;
        this.nome = nome;
    }

    /**
     * Cria uma instância de Materia a partir de uma linha do banco de dados
     * @param {Object} row
     * @returns {Materia}
     */
    static fromRow(row) {
        return Materia.fromObj({
            id: row.id_materias,
            nome: row.nome
        });
    }

    /**
     * Cria uma instância de Materia a partir de um objeto
     * @param {Object} obj
     * @returns {Materia}
     */
    static fromObj(obj) {
        return new Materia(obj.id, obj.nome);
    }
}
