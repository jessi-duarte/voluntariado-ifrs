const { pool } = require('../config/database');

/**
 * Lista todos os voluntários cadastrados.
 *
 * @returns {Promise<Array<Object>>} Lista de voluntários ordenada por nome.
 */
async function findAll() {
  const [rows] = await pool.execute(
    `SELECT id, name, email, phone, created_at
     FROM volunteers
     ORDER BY name ASC`,
  );

  return rows;
}

/**
 * Busca um voluntário pelo identificador.
 *
 * @param {number} id - Identificador do voluntário.
 * @returns {Promise<Object|null>} Voluntário encontrado ou null se não existir.
 */
async function findById(id) {
  const [rows] = await pool.execute(
    `SELECT id, name, email, phone, created_at
     FROM volunteers
     WHERE id = ?`,
    [id],
  );

  return rows[0] || null;
}

/**
 * Cadastra um novo voluntário no banco de dados.
 *
 * @param {Object} volunteer - Dados do voluntário.
 * @param {string} volunteer.name - Nome do voluntário.
 * @param {string} volunteer.email - E-mail do voluntário.
 * @param {string} [volunteer.phone] - Telefone opcional.
 * @returns {Promise<Object>} Dados do voluntário cadastrado.
 */
async function create(volunteer) {
  const { name, email, phone } = volunteer;

  const [result] = await pool.execute(
    `INSERT INTO volunteers (name, email, phone)
     VALUES (?, ?, ?)`,
    [name, email, phone || null],
  );

  return findById(result.insertId);
}

/**
 * Atualiza os dados de um voluntário existente.
 *
 * @param {number} id - Identificador do voluntário.
 * @param {Object} volunteer - Novos dados do voluntário.
 * @param {string} volunteer.name - Nome atualizado.
 * @param {string} volunteer.email - E-mail atualizado.
 * @param {string} [volunteer.phone] - Telefone atualizado ou vazio.
 * @returns {Promise<Object|null>} Voluntário atualizado ou null se não existir.
 */
async function update(id, volunteer) {
  const { name, email, phone } = volunteer;

  await pool.execute(
    `UPDATE volunteers
     SET name = ?, email = ?, phone = ?
     WHERE id = ?`,
    [name, email, phone || null, id],
  );

  return findById(id);
}

/**
 * Exclui um voluntário pelo identificador.
 *
 * @param {number} id - Identificador do voluntário.
 * @returns {Promise<boolean>} true se excluído; caso contrário, false.
 */
async function remove(id) {
  const [result] = await pool.execute('DELETE FROM volunteers WHERE id = ?', [
    id,
  ]);

  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
