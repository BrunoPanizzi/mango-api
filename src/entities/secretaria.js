import { Usuario, NovoUsuario } from './usuario.js';

// Representa uma nova secretaria a ser criada (antes de existir no banco)
export class NovoSecretaria {
    /**
     * @param {NovoUsuario} usuario
     */
    constructor(usuario) {
        this.usuario = usuario;
    }

    /**
     * Cria uma instância de NovoSecretaria a partir de um objeto
     * @param {Object} obj
     * @param {Object} obj.usuario
     * @returns {NovoSecretaria}
     */
    static fromObj(obj) {
        return new NovoSecretaria(
            NovoUsuario.fromObj(obj.usuario)
        );
    }
}

// Representa uma secretaria existente no banco
export class Secretaria {
    /**
     * @param {number} id
     * @param {Usuario} usuario
     */
    constructor(id, usuario) {
        this.id = id;
        this.usuario = usuario;
    }

    /**
     * Cria uma instância de Secretaria a partir de uma linha do banco de dados
     * 
     * @param {Object} row
     * @param {Usuario} usuario
     * @returns {Secretaria}
     */
    static fromRow(row, usuario) {
        return Secretaria.fromObj({
            id: row.id_secretaria,
            usuario,
        });
    }

    /**
     * Cria uma instância de Secretaria a partir de um objeto
     * @param {Object} obj
     * @param {number} obj.id
     * @param {Object} obj.usuario
     * @returns {Secretaria}
     */
    static fromObj(obj) {
        return new Secretaria(
            obj.id,
            Usuario.fromObj(obj.usuario)
        );
    }
}
