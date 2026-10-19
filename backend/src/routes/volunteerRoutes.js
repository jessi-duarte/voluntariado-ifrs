const express = require('express');
const volunteerController = require('../controllers/volunteerController');
const {
  authenticateToken,
  requireAdmin,
} = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Volunteer:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Maria da Silva
 *         email:
 *           type: string
 *           format: email
 *           example: maria@example.com
 *         phone:
 *           type: string
 *           example: '54999998888'
 */

/**
 * @openapi
 * /volunteers:
 *   get:
 *     summary: Listar voluntários
 *     tags: [Voluntários]
 *     responses:
 *       200:
 *         description: Lista de voluntários retornada com sucesso
 */
router.get('/', volunteerController.getAll);

/**
 * @openapi
 * /volunteers/{id}:
 *   get:
 *     summary: Buscar voluntário por ID
 *     tags: [Voluntários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Voluntário encontrado
 *       404:
 *         description: Voluntário não encontrado
 */
router.get('/:id', volunteerController.getById);

/**
 * @openapi
 * /volunteers:
 *   post:
 *     summary: Cadastrar voluntário
 *     tags: [Voluntários]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: Maria da Silva
 *               email:
 *                 type: string
 *                 format: email
 *                 example: maria@example.com
 *               phone:
 *                 type: string
 *                 example: '54999998888'
 *     responses:
 *       201:
 *         description: Voluntário cadastrado
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Acesso restrito a administradores
 *       409:
 *         description: E-mail já cadastrado
 */
router.post('/', authenticateToken, requireAdmin, volunteerController.create);

/**
 * @openapi
 * /volunteers/{id}:
 *   put:
 *     summary: Atualizar voluntário
 *     tags: [Voluntários]
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
 *             $ref: '#/components/schemas/Volunteer'
 *     responses:
 *       200:
 *         description: Voluntário atualizado
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Acesso restrito a administradores
 *       404:
 *         description: Voluntário não encontrado
 */
router.put('/:id', authenticateToken, requireAdmin, volunteerController.update);

/**
 * @openapi
 * /volunteers/{id}:
 *   delete:
 *     summary: Excluir voluntário
 *     tags: [Voluntários]
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
 *         description: Voluntário excluído
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Acesso restrito a administradores
 *       404:
 *         description: Voluntário não encontrado
 */
router.delete(
  '/:id',
  authenticateToken,
  requireAdmin,
  volunteerController.remove,
);

module.exports = router;
