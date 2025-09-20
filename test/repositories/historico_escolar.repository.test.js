import { it, describe, before, after, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'

import { NovoHistoricoEscolar, HistoricoEscolar } from '../../src/entities/historico_escolar.js'
import { HistoricoEscolarRepository } from '../../src/repositories/historico_escolar.repository.js'
import { NovoAluno, Aluno } from '../../src/entities/aluno.js'
import { AlunoRepository } from '../../src/repositories/aluno.repository.js'
import { NovaDisciplina, Disciplina } from '../../src/entities/disciplina.js'
import { DisciplinaService } from '../../src/services/disciplina.service.js'

import { get_db, cleanup } from '../../src/db/index.js'
import { migrate } from '../../src/db/migrate.js'

describe('HistoricoEscolar Repository', async () => {

    /** @type {import('pg').Client} */
    let db;
    /** @type {HistoricoEscolarRepository} */
    let historicoEscolarRepository;
    /** @type {AlunoRepository} */
    let alunoRepository;
    /** @type {DisciplinaService} */
    let disciplinaService;

    beforeEach(async () => {
        db = await get_db();
        await migrate(db);
        historicoEscolarRepository = new HistoricoEscolarRepository(db);
        alunoRepository = new AlunoRepository(db);
        disciplinaService = new DisciplinaService(db);
        await db.query("TRUNCATE TABLE historicos_escolares RESTART IDENTITY CASCADE");
        await db.query("TRUNCATE TABLE alunos RESTART IDENTITY CASCADE");
        await db.query("TRUNCATE TABLE disciplinas RESTART IDENTITY CASCADE");
    });

    afterEach(async () => {
        await db.release();
    });

    after(async () => {
        await cleanup();
    });

    it('should create a new historico escolar with disciplina', async () => {
        // Criar aluno primeiro
        const novoAluno = new NovoAluno({
            nome: 'João Silva',
            cns: '123456789012345',
            nascimento: '2010-05-10',
            genero: 'Masculino',
            telefone: '11999999999',
            logradouro: 'Rua das Flores, 123',
            numero: '123',
            bairro: 'Centro',
            cep: '01234-567',
            cidade: 'São Paulo',
            estado: 'SP',
            responsavel1Nome: 'Maria Silva',
            responsavel1Cpf: '12345678901',
            responsavel1Telefone: '11888888888',
            responsavel1Parentesco: 'Mãe'
        });
        const aluno = await alunoRepository.create(novoAluno);

        // Criar disciplina
        const novaDisciplina = new NovaDisciplina({ nome: 'Matemática' });
        const disciplina = await disciplinaService.create(novaDisciplina);

        // Criar histórico escolar
        const novoHistorico = new NovoHistoricoEscolar({
            idAluno: aluno.id,
            idDisciplina: disciplina.id,
            nomeEscola: 'Escola Municipal João da Silva',
            serieConcluida: '5º Ano',
            nota: 8.5,
            anoConclusao: 2023
        });

        const historico = await historicoEscolarRepository.create(novoHistorico);

        assert.ok(historico instanceof HistoricoEscolar);
        assert.strictEqual(historico.idAluno, aluno.id);
        assert.strictEqual(historico.idDisciplina, disciplina.id);
        assert.strictEqual(historico.nomeEscola, 'Escola Municipal João da Silva');
        assert.strictEqual(historico.serieConcluida, '5º Ano');
        assert.strictEqual(historico.nota, 8.5);
        assert.strictEqual(historico.anoConclusao, 2023);
        assert.ok(historico.id > 0);
        assert.ok(historico.createdAt instanceof Date);
        assert.ok(historico.updatedAt instanceof Date);
    });

    it('should create a new historico escolar without disciplina', async () => {
        // Criar aluno primeiro
        const novoAluno = new NovoAluno({
            nome: 'Ana Santos',
            cns: '987654321012345',
            nascimento: '2011-03-15',
            genero: 'Feminino',
            telefone: '11555555555',
            logradouro: 'Av. Principal',
            numero: '456',
            bairro: 'Vila Nova',
            cep: '54321-098',
            cidade: 'Rio de Janeiro',
            estado: 'RJ',
            responsavel1Nome: 'Carlos Santos',
            responsavel1Cpf: '55544433322',
            responsavel1Telefone: '11444444444',
            responsavel1Parentesco: 'Pai'
        });
        const aluno = await alunoRepository.create(novoAluno);

        // Criar histórico escolar sem disciplina
        const novoHistorico = new NovoHistoricoEscolar({
            idAluno: aluno.id,
            idDisciplina: null,
            nomeEscola: 'Colégio Estadual Santos',
            serieConcluida: '6º Ano',
            nota: 7.8,
            anoConclusao: 2023
        });

        const historico = await historicoEscolarRepository.create(novoHistorico);

        assert.ok(historico instanceof HistoricoEscolar);
        assert.strictEqual(historico.idAluno, aluno.id);
        assert.strictEqual(historico.idDisciplina, null);
        assert.strictEqual(historico.nomeEscola, 'Colégio Estadual Santos');
        assert.strictEqual(historico.serieConcluida, '6º Ano');
        assert.strictEqual(historico.nota, 7.8);
    });

    it('should get a historico escolar by ID', async () => {
        const novoAluno = new NovoAluno({
            nome: 'Pedro Costa',
            cns: '111222333444555',
            nascimento: '2012-01-02',
            genero: 'Masculino',
            telefone: '11999999999',
            logradouro: 'Rua Get',
            numero: '10',
            bairro: 'Bairro Get',
            cep: '12345-678',
            cidade: 'Cidade Get',
            estado: 'SP',
            responsavel1Nome: 'Responsável Get',
            responsavel1Cpf: '11111111111',
            responsavel1Telefone: '11888888888',
            responsavel1Parentesco: 'Pai'
        });
        const aluno = await alunoRepository.create(novoAluno);

        const novoHistorico = new NovoHistoricoEscolar({
            idAluno: aluno.id,
            nomeEscola: 'Escola Get Test',
            serieConcluida: '4º Ano',
            nota: 9.2,
            anoConclusao: 2023
        });
        const createdHistorico = await historicoEscolarRepository.create(novoHistorico);

        const historico = await historicoEscolarRepository.getById(createdHistorico.id);

        assert.ok(historico instanceof HistoricoEscolar);
        assert.strictEqual(historico.id, createdHistorico.id);
        assert.strictEqual(historico.idAluno, aluno.id);
        assert.strictEqual(historico.nomeEscola, 'Escola Get Test');
        assert.strictEqual(historico.serieConcluida, '4º Ano');
        assert.strictEqual(historico.nota, 9.2);
    });

    it('should return null when getting a non-existent historico escolar', async () => {
        const historico = await historicoEscolarRepository.getById(9999);
        assert.strictEqual(historico, null);
    });

    it('should get historicos escolares by aluno ID', async () => {
        const novoAluno = new NovoAluno({
            nome: 'Maria Oliveira',
            cns: '555666777888999',
            nascimento: '2009-07-20',
            genero: 'Feminino',
            telefone: '11777777777',
            logradouro: 'Rua Aluno Test',
            numero: '100',
            bairro: 'Bairro Test',
            cep: '98765-432',
            cidade: 'Cidade Test',
            estado: 'MG',
            responsavel1Nome: 'Resp Test',
            responsavel1Cpf: '99999999999',
            responsavel1Telefone: '11666666666',
            responsavel1Parentesco: 'Mãe'
        });
        const aluno = await alunoRepository.create(novoAluno);

        // Criar múltiplos históricos para o mesmo aluno
        const historico1 = await historicoEscolarRepository.create(new NovoHistoricoEscolar({
            idAluno: aluno.id,
            nomeEscola: 'Escola A',
            serieConcluida: '1º Ano',
            nota: 8.0,
            anoConclusao: 2022
        }));

        const historico2 = await historicoEscolarRepository.create(new NovoHistoricoEscolar({
            idAluno: aluno.id,
            nomeEscola: 'Escola B',
            serieConcluida: '2º Ano',
            nota: 8.5,
            anoConclusao: 2023
        }));

        const historicos = await historicoEscolarRepository.getByAlunoId(aluno.id);

        assert.ok(Array.isArray(historicos));
        assert.strictEqual(historicos.length, 2);
        assert.ok(historicos.every(h => h instanceof HistoricoEscolar));
        assert.ok(historicos.every(h => h.idAluno === aluno.id));
        assert.ok(historicos.some(h => h.nomeEscola === 'Escola A' && h.serieConcluida === '1º Ano'));
        assert.ok(historicos.some(h => h.nomeEscola === 'Escola B' && h.serieConcluida === '2º Ano'));
    });

    it('should get historicos escolares by disciplina ID', async () => {
        const novoAluno1 = new NovoAluno({
            nome: 'Aluno 1',
            cns: '111111111111111',
            nascimento: '2010-01-01',
            genero: 'Masculino',
            telefone: '11111111111',
            logradouro: 'Rua 1',
            numero: '1',
            bairro: 'Bairro 1',
            cep: '11111-111',
            cidade: 'Cidade 1',
            estado: 'SP',
            responsavel1Nome: 'Resp 1',
            responsavel1Cpf: '11111111111',
            responsavel1Telefone: '11111111111',
            responsavel1Parentesco: 'Pai'
        });
        const aluno1 = await alunoRepository.create(novoAluno1);

        const novoAluno2 = new NovoAluno({
            nome: 'Aluno 2',
            cns: '222222222222222',
            nascimento: '2010-02-02',
            genero: 'Feminino',
            telefone: '22222222222',
            logradouro: 'Rua 2',
            numero: '2',
            bairro: 'Bairro 2',
            cep: '22222-222',
            cidade: 'Cidade 2',
            estado: 'RJ',
            responsavel1Nome: 'Resp 2',
            responsavel1Cpf: '22222222222',
            responsavel1Telefone: '22222222222',
            responsavel1Parentesco: 'Mãe'
        });
        const aluno2 = await alunoRepository.create(novoAluno2);

        const novaDisciplina = new NovaDisciplina({ nome: 'História' });
        const disciplina = await disciplinaService.create(novaDisciplina);

        // Criar históricos para diferentes alunos na mesma disciplina
        await historicoEscolarRepository.create(new NovoHistoricoEscolar({
            idAluno: aluno1.id,
            idDisciplina: disciplina.id,
            nomeEscola: 'Escola História 1',
            serieConcluida: '3º Ano',
            nota: 7.5,
            anoConclusao: 2023
        }));

        await historicoEscolarRepository.create(new NovoHistoricoEscolar({
            idAluno: aluno2.id,
            idDisciplina: disciplina.id,
            nomeEscola: 'Escola História 2',
            serieConcluida: '3º Ano',
            nota: 8.0,
            anoConclusao: 2024
        }));

        const historicos = await historicoEscolarRepository.getByDisciplinaId(disciplina.id);

        assert.ok(Array.isArray(historicos));
        assert.strictEqual(historicos.length, 2);
        assert.ok(historicos.every(h => h instanceof HistoricoEscolar));
        assert.ok(historicos.every(h => h.idDisciplina === disciplina.id));
        assert.ok(historicos.some(h => h.idAluno === aluno1.id && h.nomeEscola === 'Escola História 1'));
        assert.ok(historicos.some(h => h.idAluno === aluno2.id && h.nomeEscola === 'Escola História 2'));
    });

    it('should list all historicos escolares', async () => {
        const novoAluno = new NovoAluno({
            nome: 'Aluno List',
            cns: '333333333333333',
            nascimento: '2011-01-01',
            genero: 'Masculino',
            telefone: '33333333333',
            logradouro: 'Rua List',
            numero: '3',
            bairro: 'Bairro List',
            cep: '33333-333',
            cidade: 'Cidade List',
            estado: 'SP',
            responsavel1Nome: 'Resp List',
            responsavel1Cpf: '33333333333',
            responsavel1Telefone: '33333333333',
            responsavel1Parentesco: 'Pai'
        });
        const aluno = await alunoRepository.create(novoAluno);

        await historicoEscolarRepository.create(new NovoHistoricoEscolar({
            idAluno: aluno.id,
            nomeEscola: 'Escola Lista 1',
            serieConcluida: '1º Ano',
            nota: 7.0,
            anoConclusao: 2023
        }));

        await historicoEscolarRepository.create(new NovoHistoricoEscolar({
            idAluno: aluno.id,
            nomeEscola: 'Escola Lista 2',
            serieConcluida: '2º Ano',
            nota: 8.0,
            anoConclusao: 2024
        }));

        const historicos = await historicoEscolarRepository.list();

        assert.ok(Array.isArray(historicos));
        assert.strictEqual(historicos.length, 2);
        assert.ok(historicos.every(h => h instanceof HistoricoEscolar));
        assert.ok(historicos.some(h => h.nomeEscola === 'Escola Lista 1' && h.serieConcluida === '1º Ano'));
        assert.ok(historicos.some(h => h.nomeEscola === 'Escola Lista 2' && h.serieConcluida === '2º Ano'));
    });

    it('should update a historico escolar', async () => {
        const novoAluno = new NovoAluno({
            nome: 'Aluno Update',
            cns: '444444444444444',
            nascimento: '2010-01-01',
            genero: 'Masculino',
            telefone: '44444444444',
            logradouro: 'Rua Update',
            numero: '4',
            bairro: 'Bairro Update',
            cep: '44444-444',
            cidade: 'Cidade Update',
            estado: 'SP',
            responsavel1Nome: 'Resp Update',
            responsavel1Cpf: '44444444444',
            responsavel1Telefone: '44444444444',
            responsavel1Parentesco: 'Pai'
        });
        const aluno = await alunoRepository.create(novoAluno);

        const novaDisciplina = new NovaDisciplina({ nome: 'Geografia' });
        const disciplina = await disciplinaService.create(novaDisciplina);

        const createdHistorico = await historicoEscolarRepository.create(new NovoHistoricoEscolar({
            idAluno: aluno.id,
            idDisciplina: disciplina.id,
            nomeEscola: 'Escola Original',
            serieConcluida: '5º Ano',
            nota: 7.0,
            anoConclusao: 2023
        }));

        const updatedHistorico = await historicoEscolarRepository.update(createdHistorico.id, {
            idAluno: aluno.id,
            idDisciplina: disciplina.id,
            nomeEscola: 'Escola Atualizada',
            serieConcluida: '6º Ano',
            nota: 9.5,
            anoConclusao: 2024
        });

        assert.ok(updatedHistorico instanceof HistoricoEscolar);
        assert.strictEqual(updatedHistorico.id, createdHistorico.id);
        assert.strictEqual(updatedHistorico.nomeEscola, 'Escola Atualizada');
        assert.strictEqual(updatedHistorico.serieConcluida, '6º Ano');
        assert.strictEqual(updatedHistorico.nota, 9.5);
        assert.strictEqual(updatedHistorico.anoConclusao, 2024);
        assert.ok(updatedHistorico.updatedAt > createdHistorico.updatedAt);
    });

    it('should throw error when updating non-existent historico escolar', async () => {
        try {
            await historicoEscolarRepository.update(9999, {
                idAluno: 1,
                nomeEscola: 'Test',
                serieConcluida: 'Test',
                nota: 8.0
            });
            assert.fail('Should have thrown an error');
        } catch (error) {
            assert.strictEqual(error.message, 'Histórico escolar não encontrado');
        }
    });

    it('should delete a historico escolar', async () => {
        const novoAluno = new NovoAluno({
            nome: 'Aluno Delete',
            cns: '555555555555555',
            nascimento: '2010-01-01',
            genero: 'Masculino',
            telefone: '55555555555',
            logradouro: 'Rua Delete',
            numero: '5',
            bairro: 'Bairro Delete',
            cep: '55555-555',
            cidade: 'Cidade Delete',
            estado: 'SP',
            responsavel1Nome: 'Resp Delete',
            responsavel1Cpf: '55555555555',
            responsavel1Telefone: '55555555555',
            responsavel1Parentesco: 'Pai'
        });
        const aluno = await alunoRepository.create(novoAluno);

        const createdHistorico = await historicoEscolarRepository.create(new NovoHistoricoEscolar({
            idAluno: aluno.id,
            nomeEscola: 'Escola Delete',
            serieConcluida: '3º Ano',
            nota: 6.0,
            anoConclusao: 2023
        }));

        await historicoEscolarRepository.delete(createdHistorico.id);

        const deletedHistorico = await historicoEscolarRepository.getById(createdHistorico.id);
        assert.strictEqual(deletedHistorico, null);
    });

    it('should throw error when deleting non-existent historico escolar', async () => {
        try {
            await historicoEscolarRepository.delete(9999);
            assert.fail('Should have thrown an error');
        } catch (error) {
            assert.strictEqual(error.message, 'Histórico escolar não encontrado');
        }
    });
});