
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Realizar login
 *     description: Autentica o usuário e retorna um token JWT para acessar as rotas protegidas.
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@voluntariado.local
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SenhaForte123
 *     responses:
 *       '200':
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticação
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     role:
 *                       type: string
 *                       example: admin
 *       '400':
 *         description: E-mail e senha são obrigatórios
 *       '401':
 *         description: E-mail ou senha incorretos
 *       '500':
 *         description: Erro interno ao realizar login
 */
router.post('/login', authController.login);

module.exports = router;
