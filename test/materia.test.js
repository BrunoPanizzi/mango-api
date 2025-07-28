import { it, describe, beforeEach, afterEach, after } from 'node:test';
import assert from 'node:assert/strict';

import { NovoMateria, Materia } from '../src/entities/materia.js';
import { MateriaService } from '../src/services/materia.service.js';

import { get_db, cleanup } from '../src/db/index.js';
import { migrate } from '../src/db/migrate.js';

describe('Materia Service', async () => {
    /** @type {import('pg').Client} */
    let db;
    /** @type {MateriaService} */
    let materiaService;

    beforeEach(async () => {
        db = await get_db();
        await migrate(db);
        materiaService = new MateriaService(db);
        await db.query("TRUNCATE TABLE materias RESTART IDENTITY CASCADE");
    });

    afterEach(async () => {
        await db.release();
    });

    after(async () => {
        await cleanup();
    });

    it('should create a new materia', async () => {
        const novoMateria = NovoMateria.fromObj({ nome: 'Matemática' });
        const materia = await materiaService.create(novoMateria);

        assert.ok(materia instanceof Materia);
        assert.strictEqual(materia.nome, 'Matemática');
        assert.ok(typeof materia.id === 'number');
    });

    it('should list all materias', async () => {
        await materiaService.create(NovoMateria.fromObj({ nome: 'Matemática' }));
        await materiaService.create(NovoMateria.fromObj({ nome: 'Física' }));

        const materias = await materiaService.list();

        assert.ok(Array.isArray(materias));
        assert.strictEqual(materias.length, 2);
        assert.ok(materias.some(m => m.nome === 'Matemática'));
        assert.ok(materias.some(m => m.nome === 'Física'));
        assert.ok(materias.every(m => m instanceof Materia));
    });

    it('should get a materia by ID', async () => {
        const created = await materiaService.create(NovoMateria.fromObj({ nome: 'Química' }));
        const materia = await materiaService.getById(created.id);

        assert.ok(materia instanceof Materia);
        assert.strictEqual(materia.nome, 'Química');
        assert.strictEqual(materia.id, created.id);
    });

    it('should return null when getting a non-existent materia', async () => {
        const materia = await materiaService.getById(9999);
        assert.strictEqual(materia, null);
    });

    it('should update a materia', async () => {
        const created = await materiaService.create(NovoMateria.fromObj({ nome: 'Biologia' }));
        const updated = await materiaService.update(created.id, NovoMateria.fromObj({ nome: 'Geografia' }));

        assert.ok(updated instanceof Materia);
        assert.strictEqual(updated.nome, 'Geografia');
        assert.strictEqual(updated.id, created.id);

        // Confirm update in DB
        const fetched = await materiaService.getById(created.id);
        assert.strictEqual(fetched.nome, 'Geografia');
    });

    it('should throw when updating a non-existent materia', async () => {
        await assert.rejects(
            () => materiaService.update(9999, NovoMateria.fromObj({ nome: 'Filosofia' })),
            /Matéria não encontrada/
        );
    });

    it('should delete a materia', async () => {
        const created = await materiaService.create(NovoMateria.fromObj({ nome: 'Artes' }));
        await materiaService.delete(created.id);

        const deleted = await materiaService.getById(created.id);
        assert.strictEqual(deleted, null);
    });

    it('should throw when deleting a non-existent materia', async () => {
        await assert.rejects(
            () => materiaService.delete(9999),
            /Matéria não encontrada/
        );
    });

    it('should handle empty list', async () => {
        const materias = await materiaService.list();
        assert.ok(Array.isArray(materias));
        assert.strictEqual(materias.length, 0);
    });
});
