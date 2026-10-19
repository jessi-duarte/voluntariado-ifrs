const { pool } = require('../config/database');

/**
 * Busca todos os eventos cadastrados no banco de dados.
 *
 * @returns {Promise<Array<Object>>} Lista de eventos ordenada por data.
 */
async function findAll() {
  const [rows] = await pool.query(
    `SELECT
      id,
      title,
      description,
      event_date,
      location,
      max_volunteers,
      status,
      created_at
    FROM events
    ORDER BY event_date ASC`,
  );

  return rows;
}

/**
 * Busca um evento pelo identificador.
 *
 * @param {number} id - Identificador do evento.
 * @returns {Promise<Object|null>} Evento encontrado ou null se não existir.
 */
async function findById(id) {
  const [rows] = await pool.execute('SELECT * FROM events WHERE id = ?', [id]);

  return rows[0] || null;
}

/**
 * Cria um evento no banco de dados.
 *
 * @param {Object} event - Dados do evento.
 * @param {string} event.title - Título do evento.
 * @param {string} [event.description] - Descrição do evento.
 * @param {string} event.event_date - Data e hora do evento.
 * @param {string} event.location - Local do evento.
 * @param {number} [event.max_volunteers=20] - Limite de voluntários.
 * @returns {Promise<Object>} Dados do evento criado.
 */
async function create(event) {
  const { title, description, event_date, location, max_volunteers } = event;

  const [result] = await pool.execute(
    `INSERT INTO events
      (title, description, event_date, location, max_volunteers)
     VALUES (?, ?, ?, ?, ?)`,
    [title, description || null, event_date, location, max_volunteers ?? 20],
  );

  const [rows] = await pool.execute('SELECT * FROM events WHERE id = ?', [
    result.insertId,
  ]);

  return rows[0];
}

/**
 * Atualiza os dados de um evento existente.
 *
 * @param {number} id - Identificador do evento.
 * @param {Object} event - Novos dados do evento.
 * @returns {Promise<Object|null>} Evento atualizado ou null se não existir.
 */
async function update(id, event) {
  const { title, description, event_date, location, max_volunteers, status } =
    event;

  const [result] = await pool.execute(
    `UPDATE events
     SET title = ?,
         description = ?,
         event_date = ?,
         location = ?,
         max_volunteers = ?,
         status = ?
     WHERE id = ?`,
    [
      title,
      description ?? null,
      event_date,
      location,
      max_volunteers,
      status,
      id,
    ],
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return findById(id);
}

/**
 * Exclui um evento do banco de dados.
 *
 * @param {number} id - Identificador do evento.
 * @returns {Promise<boolean>} true se um evento foi excluído; caso contrário, false.
 */
async function remove(id) {
  const [result] = await pool.execute('DELETE FROM events WHERE id = ?', [id]);

  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
