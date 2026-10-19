const eventModel = require('../models/eventModel');

/**
 * Retorna todos os eventos cadastrados.
 *
 * @returns {Promise<Array<Object>>} Lista de eventos.
 */
async function listEvents() {
  return eventModel.findAll();
}

/**
 * Valida os dados e cadastra um novo evento.
 *
 * @param {Object} event - Dados do evento.
 * @param {string} event.title - Título do evento.
 * @param {string} event.event_date - Data e hora do evento.
 * @param {string} event.location - Local do evento.
 * @param {string} [event.description] - Descrição opcional.
 * @param {number} [event.max_volunteers] - Limite de voluntários.
 * @returns {Promise<Object>} Evento cadastrado.
 * @throws {Error} Erro 400 quando os campos obrigatórios ou o limite são inválidos.
 */
async function createEvent(event) {
  const { title, event_date, location, max_volunteers } = event;

  if (!title || !event_date || !location) {
    const error = new Error('Título, data e local são obrigatórios.');
    error.statusCode = 400;
    throw error;
  }

  if (
    max_volunteers !== undefined &&
    (!Number.isInteger(Number(max_volunteers)) || Number(max_volunteers) <= 0)
  ) {
    const error = new Error(
      'O limite de voluntários deve ser um número inteiro positivo.',
    );
    error.statusCode = 400;
    throw error;
  }

  return eventModel.create(event);
}

/**
 * Busca um evento pelo identificador.
 *
 * @param {number} id - Identificador do evento.
 * @returns {Promise<Object>} Evento encontrado.
 * @throws {Error} Erro 404 quando o evento não existe.
 */
async function getEventById(id) {
  const event = await eventModel.findById(id);

  if (!event) {
    const error = new Error('Evento não encontrado.');
    error.statusCode = 404;
    throw error;
  }

  return event;
}

/**
 * Valida e atualiza os dados de um evento existente.
 *
 * @param {number} id - Identificador do evento.
 * @param {Object} data - Dados atualizados do evento.
 * @returns {Promise<Object|null>} Evento atualizado ou null se não encontrado na atualização.
 * @throws {Error} Erro 400 quando os dados são inválidos.
 * @throws {Error} Erro 404 quando o evento não existe.
 */
async function updateEvent(id, data) {
  const currentEvent = await getEventById(id);

  const requiredFields = [
    'title',
    'event_date',
    'location',
    'max_volunteers',
    'status',
  ];

  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === '') {
      const error = new Error(`O campo ${field} é obrigatório.`);
      error.statusCode = 400;
      throw error;
    }
  }

  if (
    !Number.isInteger(Number(data.max_volunteers)) ||
    Number(data.max_volunteers) <= 0
  ) {
    const error = new Error(
      'O limite de voluntários deve ser um inteiro positivo.',
    );
    error.statusCode = 400;
    throw error;
  }

  const validStatuses = ['open', 'closed', 'completed'];

  if (!validStatuses.includes(data.status)) {
    const error = new Error('Status de evento inválido.');
    error.statusCode = 400;
    throw error;
  }

  return eventModel.update(id, {
    ...currentEvent,
    ...data,
    max_volunteers: Number(data.max_volunteers),
  });
}

/**
 * Exclui um evento existente.
 *
 * @param {number} id - Identificador do evento.
 * @returns {Promise<boolean>} Indica se o evento foi excluído.
 * @throws {Error} Erro 404 quando o evento não existe.
 */
async function deleteEvent(id) {
  await getEventById(id);
  return eventModel.remove(id);
}

module.exports = {
  listEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
};
