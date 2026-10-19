const authService = require('../services/authService');

/**
 * Autentica um usuário e envia a resposta HTTP.
 *
 * @param {import('express').Request} req - Requisição com e-mail e senha.
 * @param {import('express').Response} res - Resposta HTTP.
 * @returns {Promise<import('express').Response|void>} Dados do usuário e token JWT,
 * ou uma mensagem de erro.
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    return res.status(200).json(result);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        message: error.message,
      });
    }

    console.error('Erro no login:', error.message);

    return res.status(500).json({
      message: 'Erro interno ao realizar login.',
    });
  }
}

module.exports = { login };
