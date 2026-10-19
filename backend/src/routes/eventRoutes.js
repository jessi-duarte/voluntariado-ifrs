const express = require('express');
const eventController = require('../controllers/eventController');
const {
  authenticateToken,
  requireAdmin,
} = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Event:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: Mutirão de limpeza
 *         description:
 *           type: string
 *           example: Ação voluntária de limpeza da comunidade
 *         event_date:
 *           type: string
 *           format: date-time
 *           example: '2026-11-15T09:00:00'
 *         location:
 *           type: string
 *           example: Bento Gonçalves
 *         max_volunteers:
 *           type: integer
 *           example: 20
 *         status:
 *           type: string
 *           example: aberto
 */

/**
 * @openapi
 * /events:
 *   get:
 *     summary: Listar eventos
 *     tags: [Eventos]
 *     responses:
 *       200:
 *         description: Lista de eventos retornada com sucesso
 */
router.get('/', eventController.getAll);

/**
 * @openapi
 * /events/{id}:
 *   get:
 *     summary: Buscar evento por ID
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Evento encontrado
 *       404:
 *         description: Evento não encontrado
 */
router.get('/:id', eventController.getById);

/**
 * @openapi
 * /events:
 *   post:
 *     summary: Criar evento
 *     tags: [Eventos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - event_date
 *               - location
 *             properties:
 *               title:
 *                 type: string
 *                 example: Mutirão de limpeza
 *               description:
 *                 type: string
 *                 example: Ação voluntária da comunidade
 *               event_date:
 *                 type: string
 *                 example: '2026-11-15 09:00:00'
 *               location:
 *                 type: string
 *                 example: Bento Gonçalves
 *               max_volunteers:
 *                 type: integer
 *                 example: 20
 *     responses:
 *       201:
 *         description: Evento criado
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Acesso restrito a administradores
 */
router.post('/', authenticateToken, requireAdmin, eventController.create);

/**
 * @openapi
 * /events/{id}:
 *   put:
 *     summary: Atualizar evento
 *     tags: [Eventos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Evento atualizado
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Acesso restrito a administradores
 *       404:
 *         description: Evento não encontrado
 */
router.put('/:id', authenticateToken, requireAdmin, eventController.update);

/**
 * @openapi
 * /events/{id}:
 *   delete:
 *     summary: Excluir evento
 *     tags: [Eventos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Evento excluído
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Acesso restrito a administradores
 *       404:
 *         description: Evento não encontrado
 */
router.delete('/:id', authenticateToken, requireAdmin, eventController.remove);

module.exports = router;
