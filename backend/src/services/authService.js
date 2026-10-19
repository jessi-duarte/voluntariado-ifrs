const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authModel = require('../models/authModel');

/**
 * Autentica um usuário e gera um token JWT.
 *
 * @param {string} email - E-mail informado no login.
 * @param {string} password - Senha informada no login.
 * @returns {Promise<{token: string, user: {
 *   id: number,
 *   name: string,
 *   email: string,
 *   role: string
 * }>>} Token JWT e dados públicos do usuário autenticado.
 * @throws {Error} Erro 400 quando e-mail ou senha são inválidos.
 * @throws {Error} Erro 401 quando as credenciais não correspondem.
 * @throws {Error} Erro interno quando o JWT_SECRET não está configurado.
 */

async function login(email, password) {
  if (
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    !email.trim() ||
    !password
  ) {
    const error = new Error('E-mail e senha são obrigatórios.');
    error.statusCode = 400;
    throw error;
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET não está configurado.');
  }

  const user = await authModel.findByEmail(email.trim().toLowerCase());

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    const error = new Error('E-mail ou senha incorretos.');
    error.statusCode = 401;
    throw error;
  }

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '2h',
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

module.exports = { login };
