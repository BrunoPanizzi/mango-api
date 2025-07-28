import { it, describe, after, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';

import { NovoUsuario, Usuario } from '../src/entities/usuario.js';
import { NovoSecretaria, Secretaria } from '../src/entities/secretaria.js';
import { UsuarioService } from '../src/services/usuario.service.js';
import { SecretariaService } from '../src/services/secretaria.service.js';

import { get_db, cleanup } from '../src/db/index.js';
import { migrate } from '../src/db/migrate.js';

describe('Secretaria Service', async () => {
    /** @type {import('pg').Client} */
    let db;
    /** @type {UsuarioService} */
    let usuarioService;
    /** @type {SecretariaService} */
    let secretariaService;

    beforeEach(async () => {
        db = await get_db();
        await migrate(db);
        usuarioService = new UsuarioService(db);
        secretariaService = new SecretariaService(db, usuarioService);
        await db.query("TRUNCATE TABLE secretaria RESTART IDENTITY CASCADE");
        await db.query("TRUNCATE TABLE usuarios RESTART IDENTITY CASCADE");
    });

    afterEach(async () => {
        await db.release();
    });

    after(async () => {
        await cleanup();
    });

    it('should create a new secretaria', async () => {
        const novoUsuario = NovoUsuario.fromObj({
            nome: 'Secretaria Test',
            senha: 'senha',
            email: 'secretaria@test.com',
            tipo_usuario: 'secretaria',
        });
        const novoSecretaria = NovoSecretaria.fromObj({
            usuario: novoUsuario
        });

        const secretaria = await secretariaService.create(novoSecretaria);

        assert.ok(secretaria instanceof Secretaria);
        assert.ok(secretaria.usuario instanceof Usuario);
        assert.strictEqual(secretaria.usuario.nome, 'Secretaria Test');
        assert.strictEqual(secretaria.usuario.email, 'secretaria@test.com');
        assert.strictEqual(secretaria.usuario.tipo_usuario, 'secretaria');
    });

    it('should list all secretarias', async () => {
        const novoUsuario1 = NovoUsuario.fromObj({
            nome: 'Secretaria One',
            senha: 'senha1',
            email: 'secretaria1@test.com',
            tipo_usuario: 'secretaria',
        });
        const novoUsuario2 = NovoUsuario.fromObj({
            nome: 'Secretaria Two',
            senha: 'senha2',
            email: 'secretaria2@test.com',
            tipo_usuario: 'secretaria',
        });
        await secretariaService.create(NovoSecretaria.fromObj({ usuario: novoUsuario1 }));
        await secretariaService.create(NovoSecretaria.fromObj({ usuario: novoUsuario2 }));

        const secretarias = await secretariaService.list();

        assert.ok(Array.isArray(secretarias));
        assert.strictEqual(secretarias.length, 2);
        assert.ok(secretarias.some(s => s.usuario.nome === 'Secretaria One' && s.usuario.email === 'secretaria1@test.com'));
        assert.ok(secretarias.some(s => s.usuario.nome === 'Secretaria Two' && s.usuario.email === 'secretaria2@test.com'));
        assert.ok(secretarias.every(s => s instanceof Secretaria));
        assert.ok(secretarias.every(s => s.usuario instanceof Usuario));
    });

    it('should get a secretaria by ID', async () => {
        const novoUsuario = NovoUsuario.fromObj({
            nome: 'Secretaria Get',
            senha: 'senha',
            email: 'secretaria.get@test.com',
            tipo_usuario: 'secretaria',
        });
        const createdSecretaria = await secretariaService.create(NovoSecretaria.fromObj({ usuario: novoUsuario }));

        const secretaria = await secretariaService.getById(createdSecretaria.id);

        assert.ok(secretaria instanceof Secretaria);
        assert.strictEqual(secretaria.usuario.nome, 'Secretaria Get');
        assert.strictEqual(secretaria.usuario.email, 'secretaria.get@test.com');
    });

    it('should return null when getting a non-existent secretaria', async () => {
        const secretaria = await secretariaService.getById(9999);
        assert.strictEqual(secretaria, null);
    });

    it('should update a secretaria', async () => {
        const novoUsuario = NovoUsuario.fromObj({
            nome: 'Secretaria Update',
            senha: 'senha',
            email: 'secretaria.update@test.com',
            tipo_usuario: 'secretaria',
        });
        const createdSecretaria = await secretariaService.create(NovoSecretaria.fromObj({ usuario: novoUsuario }));

        const updatedUsuario = NovoUsuario.fromObj({
            nome: 'Updated Secretaria',
            senha: 'nova_senha',
            email: 'updated.secretaria@test.com',
            tipo_usuario: 'secretaria',
        });
        const updatedSecretaria = await secretariaService.update(createdSecretaria.id, NovoSecretaria.fromObj({ usuario: updatedUsuario }));

        assert.ok(updatedSecretaria instanceof Secretaria);
        assert.strictEqual(updatedSecretaria.usuario.nome, 'Updated Secretaria');
        assert.strictEqual(updatedSecretaria.usuario.email, 'updated.secretaria@test.com');
        assert.strictEqual(updatedSecretaria.id, createdSecretaria.id);
    });

    it('should delete a secretaria', async () => {
        const novoUsuario = NovoUsuario.fromObj({
            nome: 'Secretaria Delete',
            senha: 'senha',
            email: 'secretaria.delete@test.com',
            tipo_usuario: 'secretaria',
        });
        const createdSecretaria = await secretariaService.create(NovoSecretaria.fromObj({ usuario: novoUsuario }));

        await secretariaService.delete(createdSecretaria.id);

        const deletedSecretaria = await secretariaService.getById(createdSecretaria.id);
        assert.strictEqual(deletedSecretaria, null);
    });

    it('should get a secretaria by usuario_id', async () => {
        const novoUsuario = NovoUsuario.fromObj({
            nome: 'Secretaria ByUser',
            senha: 'senha',
            email: 'secretaria.byuser@test.com',
            tipo_usuario: 'secretaria',
        });
        const novoSecretaria = NovoSecretaria.fromObj({
            usuario: novoUsuario
        });

        const createdSecretaria = await secretariaService.create(novoSecretaria);

        const secretaria = await secretariaService.getByUsuarioId(createdSecretaria.usuario.id);

        assert.ok(secretaria instanceof Secretaria);
        assert.strictEqual(secretaria.usuario.nome, 'Secretaria ByUser');
        assert.strictEqual(secretaria.usuario.email, 'secretaria.byuser@test.com');
    });

    it('should return null when getting a secretaria by non-existent usuario_id', async () => {
        const secretaria = await secretariaService.getByUsuarioId(9999);
        assert.strictEqual(secretaria, null);
    });
});
