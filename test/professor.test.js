import { it, describe, before, after, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'

import { NovoUsuario, Usuario } from '../src/entities/usuario.js'
import { NovoProfessor, Professor } from '../src/entities/professor.js'
import { UsuarioService } from '../src/services/usuario.service.js'
import { ProfessorService } from '../src/services/professor.service.js'

import { get_db, cleanup } from '../src/db/index.js'
import { migrate } from '../src/db/migrate.js'

describe('Professor Service', async () => {
    /** @type {import('pg').Client} */
    let db;
    /** @type {UsuarioService} */
    let usuarioService;
    /** @type {ProfessorService} */
    let professorService;

    beforeEach(async () => {
        db = await get_db();
        await migrate(db);
        usuarioService = new UsuarioService(db);
        professorService = new ProfessorService(db, usuarioService);
        await db.query("TRUNCATE TABLE professores RESTART IDENTITY CASCADE");
        await db.query("TRUNCATE TABLE usuarios RESTART IDENTITY CASCADE");
    });

    afterEach(async () => {
        await db.release();
    });

    after(async () => {
        await cleanup();
    });

    it('should create a new professor', async () => {
        const novoUsuario = NovoUsuario.fromObj({
            nome: 'Professor Test',
            senha: 'senha',
            email: 'professor@test.com',
            tipo_usuario: 'professor', // TODO: remove this
        });
        const novoProfessor = NovoProfessor.fromObj({
            usuario: novoUsuario,
            disciplina_especialidade: 'Matemática'
        });

        const professor = await professorService.create(novoProfessor);

        assert.ok(professor instanceof Professor);
        assert.strictEqual(professor.disciplina_especialidade, 'Matemática');
        assert.ok(professor.usuario instanceof Usuario);
        assert.strictEqual(professor.usuario.nome, 'Professor Test');
    });

    it('should list all professors', async () => {
        const novoProfessor1 = NovoProfessor.fromObj({
            usuario: NovoUsuario.fromObj({
                nome: 'Professor One',
                senha: 'senha1',
                email: 'professor1@test.com',
                tipo_usuario: 'professor', // TODO: remove this
            }),
            disciplina_especialidade: 'Matemática'
        });
        await professorService.create(novoProfessor1);

        const novoProfessor2 = NovoProfessor.fromObj({
            usuario: NovoUsuario.fromObj({
                nome: 'Professor Two',
                senha: 'senha2',
                email: 'professor2@test.com',
                tipo_usuario: 'professor', // TODO: remove this
            }),
            disciplina_especialidade: 'Física'
        });
        await professorService.create(novoProfessor2);

        const professores = await professorService.list();

        assert.ok(Array.isArray(professores));
        assert.strictEqual(professores.length, 2);
        assert.ok(professores.some(p => p.usuario.nome === 'Professor One' && p.disciplina_especialidade === 'Matemática'));
        assert.ok(professores.some(p => p.usuario.nome === 'Professor Two' && p.disciplina_especialidade === 'Física'));
        assert.ok(professores.every(p => p instanceof Professor));
        assert.ok(professores.every(p => p.usuario instanceof Usuario));
    });

    it('should get a professor by ID', async () => {
        const novoProfessor = NovoProfessor.fromObj({
            usuario: NovoUsuario.fromObj({
                nome: 'Professor Get',
                senha: 'senha',
                email: 'professor.get@test.com',
                tipo_usuario: 'professor',
            }),
            disciplina_especialidade: 'Química'
        });

        const createdProfessor = await professorService.create(novoProfessor);

        const professor = await professorService.getById(createdProfessor.id);

        assert.ok(professor instanceof Professor);
        assert.strictEqual(professor.disciplina_especialidade, 'Química');
        assert.ok(professor.usuario instanceof Usuario);
        assert.strictEqual(professor.usuario.nome, 'Professor Get');
    });

    it('should return null when getting a non-existent professor', async () => {
        const professor = await professorService.getById(9999);
        assert.strictEqual(professor, null);
    });

    it('should delete a professor', async () => {
        const novoProfessor = NovoProfessor.fromObj({
            usuario: NovoUsuario.fromObj({
                nome: 'Professor Delete',
                senha: 'senha',
                email: 'professor.delete@test.com',
                tipo_usuario: 'professor',
            }),
            disciplina_especialidade: 'Matemática'
        });

        const createdProfessor = await professorService.create(novoProfessor);

        await professorService.delete(createdProfessor.id);

        const deletedProfessor = await professorService.getById(createdProfessor.id);
        assert.strictEqual(deletedProfessor, null);
    });

    it('should update a professor', async () => {
        const novoProfessor = NovoProfessor.fromObj({
            usuario: NovoUsuario.fromObj({
                nome: 'Professor Update',
                senha: 'senha',
                email: 'professor.update@test.com',
                tipo_usuario: 'professor',
            }),
            disciplina_especialidade: 'Biologia'
        });

        const createdProfessor = await professorService.create(novoProfessor);

        const updatedProfessor = await professorService.update(createdProfessor.id, {
            usuario: {
                nome: 'Professor Update',
                senha: 'nova_senha',
                email: 'professor.update@test.com',
                tipo_usuario: 'professor',
            },
            disciplina_especialidade: 'Biologia'
        });

        assert.ok(updatedProfessor instanceof Professor);
        assert.strictEqual(updatedProfessor.disciplina_especialidade, 'Biologia');
        assert.ok(updatedProfessor.usuario instanceof Usuario);
        assert.strictEqual(updatedProfessor.usuario.nome, 'Professor Update');
    });
});
