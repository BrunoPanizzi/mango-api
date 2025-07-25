import { Router } from 'express';
import { ProfessorService } from '../services/professor.service.js';
import { UsuarioService } from '../services/usuario.service.js';

/**
 * Cria e retorna um router de professor, recebendo a conexão db
 * 
 * @param {import('../db/index.js').PoolClient} db
 * 
 * @returns {Router}
 */
export function createProfessorRouter(db) {
    const usuarioService = new UsuarioService(db);
    const professorService = new ProfessorService(db, usuarioService);
    const router = Router();

    router.get('/', async (req, res) => {
        const professores = await professorService.list();
        res.json(professores);
    });

    router.get('/:id', async (req, res) => {
        const professor = await professorService.getById(req.params.id);

        if (!professor) {
            return res.status(404).json({ error: 'Professor não encontrado' });
        }

        res.json(professor);
    });

    router.post('/', async (req, res) => {
        const novoProfessor = req.body;

        try {
            const professorCriado = await professorService.create(novoProfessor);
            res.status(201).json(professorCriado);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    router.put('/:id', async (req, res) => {
        const id = req.params.id;
        const novoProfessor = req.body;

        try {
            const professorAtualizado = await professorService.update(id, novoProfessor);

            res.json(professorAtualizado);
        } catch (error) {
            if (error.message === "Professor não encontrado") {
                return res.status(404).json({ error: error.message });
            }
            res.status(400).json({ error: error.message });
        }
    });

    router.delete('/:id', async (req, res) => {
        const id = req.params.id;

        try {
            await professorService.delete(id);
            res.status(204).send();
        } catch (error) {
            if (error.message === "Professor não encontrado") {
                return res.status(404).json({ error: error.message });
            }
            res.status(400).json({ error: error.message });
        }
    });

    return router;
}
