const { pool } = require('../config/database');

/**
 * Busca um usuário pelo endereço de e-mail.
 *
 * @param {string} email - E-mail usado para localizar o usuário.
 * @returns {Promise<Object|null>} Dados do usuário encontrado,
 * ou null quando não existe registro correspondente.
 */
async function findByEmail(email) {
  const [rows] = await pool.execute(
    `SELECT id, name, email, password_hash, role
     FROM users
     WHERE email = ?`,
    [email],
  );

  return rows[0] || null;
}

/**
 * Cria um usuário no banco de dados.
 *
 * @param {Object} user - Dados necessários para cadastrar o usuário.
 * @param {string} user.name - Nome do usuário.
 * @param {string} user.email - E-mail do usuário.
 * @param {string} user.passwordHash - Hash da senha.
 * @param {string} user.role - Perfil de acesso do usuário.
 * @returns {Promise<Object>} Dados do usuário criado,
 * sem incluir o hash da senha.
 */
async function create(user) {
  const { name, email, passwordHash, role } = user;

  const [result] = await pool.execute(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES (?, ?, ?, ?)`,
    [name, email, passwordHash, role],
  );

  return {
    id: result.insertId,
    name,
    email,
    role,
  };
}

module.exports = {
  findByEmail,
  create,
};
