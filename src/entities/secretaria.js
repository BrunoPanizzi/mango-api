import { Usuario, NovoUsuario } from './usuario.js';

// Representa uma nova secretaria a ser criada (antes de existir no banco)
export class NovoSecretaria {
    /**
     * @param {number} idUsuario
     */
    constructor(idUsuario) {
        this.idUsuario = idUsuario;
    }

    /**
     * Cria uma instância de NovoSecretaria a partir de um objeto
     * @param {Object} obj
     * @param {number} obj.idUsuario
     * @returns {NovoSecretaria}
     */
    static fromObj(obj) {
        return new NovoSecretaria(
            obj.idUsuario
        );
    }
}

// Representa uma secretaria existente no banco
export class Secretaria {
    /**
     * @param {number} id
     * @param {number} idUsuario
     */
    constructor(id, idUsuario) {
        this.id = id;
        this.idUsuario = idUsuario;
    }

    /**
     * Cria uma instância de Secretaria a partir de uma linha do banco de dados
     * 
     * @param {Object} row
     * @param {number} idUsuario
     * @returns {Secretaria}
     */
    static fromRow(row, idUsuario) {
        return Secretaria.fromObj({
            id: row.id_secretaria,
            idUsuario,
        });
    }

    /**
     * Cria uma instância de Secretaria a partir de um objeto
     * @param {Object} obj
     * @param {number} obj.id
     * @param {number} obj.idUsuario
     * @returns {Secretaria}
     */
    static fromObj(obj) {
        return new Secretaria(
            obj.id,
            obj.idUsuario
        );
    }
}
