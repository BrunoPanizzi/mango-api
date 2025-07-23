export class NovoUsuario {
    /**
     * @param {string} nome
     * @param {string} email
     * @param {string} senha
     * @param {string} tipo_usuario
     */
    constructor(nome, email, senha, tipo_usuario) {
        this.nome = nome;
        this.email = email;
        this.senha = senha; // Senha deve ser tratada antes de ser armazenada
        this.tipo_usuario = tipo_usuario;
    }

    /**
     * Cria uma instância de NovoUsuario a partir de um objeto
     * @param {Object} obj
     * @param {string} obj.nome
     * @param {string} obj.email
     * @param {string} obj.senha
     * @param {string} obj.tipo_usuario
     * @returns {NovoUsuario}
     */
    static fromObj(obj) {
        return new NovoUsuario(
            obj.nome,
            obj.email,
            obj.senha,
            obj.tipo_usuario
        );
    }
}

export class Usuario {
    /**
     * @param {number} id
     * @param {string} nome
     * @param {string} email
     * @param {string} hash_senha
     * @param {string} tipo_usuario
     */
    constructor(id, nome, email, hash_senha, tipo_usuario) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.hash_senha = hash_senha;
        this.tipo_usuario = tipo_usuario;
    }

    /**
     * Cria uma instância de Usuario a partir de uma linha do banco de dados
     * @param {Object} row - A linha do banco de dados
     * 
     * @return {Usuario} Uma instância de Usuario
     */
    static fromRow(row) {
        return new Usuario(
            row.id_usuarios,
            row.nome,
            row.email,
            row.hash_senha,
            row.tipo_usuario
        );
    }

    /**
     * Cria uma instância de Usuario a partir de um objeto
     * @param {Object} obj
     * @param {number} obj.id
     * @param {string} obj.nome
     * @param {string} obj.email
     * @param {string} obj.hash_senha
     * @param {string} obj.tipo_usuario
     * @returns {Usuario}
     */
    static fromObj(obj) {
        return new Usuario(
            obj.id,
            obj.nome,
            obj.email,
            obj.hash_senha,
            obj.tipo_usuario
        );
    }
}
