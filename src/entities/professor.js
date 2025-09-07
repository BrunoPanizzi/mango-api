// Entidades simplificadas: apenas ids de FK (idUsuario, idDisciplinaEspecialidade)

export class NovoProfessor {
    /**
     * @param {number} idUsuario
     * @param {number} idDisciplinaEspecialidade
     * @param {string} telefone
     * @param {string} genero
     * @param {string} cpf
     * @param {string|Date} nascimento
     * @param {string} logradouro
     * @param {string} numero
     * @param {string} bairro
     * @param {string} cep
     * @param {string} cidade
     * @param {string} estado
     * @param {string} formacaoAcademica
     */
    constructor(
        idUsuario,
        idDisciplinaEspecialidade,
        telefone,
        genero,
        cpf,
        nascimento,
        logradouro,
        numero,
        bairro,
        cep,
        cidade,
        estado,
        formacaoAcademica
    ) {
        this.idUsuario = idUsuario;
        this.idDisciplinaEspecialidade = idDisciplinaEspecialidade;
        this.telefone = telefone;
        this.genero = genero;
        this.cpf = cpf;
        this.nascimento = nascimento instanceof Date ? nascimento : new Date(nascimento);
        this.logradouro = logradouro;
        this.numero = numero;
        this.bairro = bairro;
        this.cep = cep;
        this.cidade = cidade;
        this.estado = estado;
        this.formacaoAcademica = formacaoAcademica;
    }

    /**
     * Aceita camelCase ou snake_case
     * @param {Object} obj
     * @returns {NovoProfessor}
     */
    static fromObj(obj) {
        return new NovoProfessor(
            obj.idUsuario ?? obj.id_usuario,
            obj.idDisciplinaEspecialidade ?? obj.id_disciplina_especialidade,
            obj.telefone,
            obj.genero,
            obj.cpf,
            obj.nascimento,
            obj.logradouro,
            obj.numero,
            obj.bairro,
            obj.cep,
            obj.cidade,
            obj.estado,
            obj.formacaoAcademica ?? obj.formacao_academica
        );
    }
}

export class Professor {
    /**
     * @param {number} id
     * @param {number} idUsuario
     * @param {number} idDisciplinaEspecialidade
     * @param {string} telefone
     * @param {string} genero
     * @param {string} cpf
     * @param {string|Date} nascimento
     * @param {string} logradouro
     * @param {string} numero
     * @param {string} bairro
     * @param {string} cep
     * @param {string} cidade
     * @param {string} estado
     * @param {string} formacaoAcademica
     * @param {Date|string} [createdAt]
     * @param {Date|string} [updatedAt]
     */
    constructor(
        id,
        idUsuario,
        idDisciplinaEspecialidade,
        telefone,
        genero,
        cpf,
        nascimento,
        logradouro,
        numero,
        bairro,
        cep,
        cidade,
        estado,
        formacaoAcademica,
        createdAt,
        updatedAt
    ) {
        this.id = id;
        this.idUsuario = idUsuario;
        this.idDisciplinaEspecialidade = idDisciplinaEspecialidade;
        this.telefone = telefone;
        this.genero = genero;
        this.cpf = cpf;
        this.nascimento = nascimento instanceof Date ? nascimento : new Date(nascimento);
        this.logradouro = logradouro;
        this.numero = numero;
        this.bairro = bairro;
        this.cep = cep;
        this.cidade = cidade;
        this.estado = estado;
        this.formacaoAcademica = formacaoAcademica;
        this.createdAt = createdAt ? (createdAt instanceof Date ? createdAt : new Date(createdAt)) : undefined;
        this.updatedAt = updatedAt ? (updatedAt instanceof Date ? updatedAt : new Date(updatedAt)) : undefined;
    }

    /**
     * Aceita camelCase ou snake_case
     * @param {Object} obj
     * @returns {Professor}
     */
    static fromObj(obj) {
        return new Professor(
            obj.id ?? obj.id_professores,
            obj.idUsuario ?? obj.id_usuario,
            obj.idDisciplinaEspecialidade ?? obj.id_disciplina_especialidade,
            obj.telefone,
            obj.genero,
            obj.cpf,
            obj.nascimento,
            obj.logradouro,
            obj.numero,
            obj.bairro,
            obj.cep,
            obj.cidade,
            obj.estado,
            obj.formacaoAcademica ?? obj.formacao_academica,
            obj.createdAt ?? obj.created_at,
            obj.updatedAt ?? obj.updated_at
        );
    }
}
