import { Router } from 'express';
import { MateriaService } from '../services/materia.service.js';
import { createAuthMiddleware } from './auth.middleware.js';

/**
 * Cria e retorna um router de matéria, recebendo a conexão db
 * 
 * @param {import('../db/index.js').PoolClient} db
 * @param {HashingService} hashingService
 * 
 * @returns {Router}
 */
export function createMateriaRouter(db, hashingService) {
    const materiaService = new MateriaService(db);
    const router = Router();

    router.use(createAuthMiddleware(hashingService));

    router.get('/', async (req, res) => {
        const materias = await materiaService.list();
        res.json(materias);
    });

    router.get('/:id', async (req, res) => {
        const materia = await materiaService.getById(req.params.id);
        if (!materia) {
            return res.status(404).json({ error: 'Matéria não encontrada' });
        }
        res.json(materia);
    });

    router.post('/', async (req, res) => {
        const novoMateria = req.body;
        try {
            const materiaCriada = await materiaService.create(novoMateria);
            res.status(201).json(materiaCriada);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    router.put('/:id', async (req, res) => {
        const id = req.params.id;
        const novoMateria = req.body;
        try {
            const materiaAtualizada = await materiaService.update(id, novoMateria);
            res.json(materiaAtualizada);
        } catch (error) {
            if (error.message === "Matéria não encontrada") {
                return res.status(404).json({ error: error.message });
            }
            res.status(400).json({ error: error.message });
        }
    });

    router.delete('/:id', async (req, res) => {
        const id = req.params.id;
        try {
            await materiaService.delete(id);
            res.status(204).send();
        } catch (error) {
            if (error.message === "Matéria não encontrada") {
                return res.status(404).json({ error: error.message });
            }
            res.status(400).json({ error: error.message });
        }
    });

    return router;
}
