const eventService = require('../services/eventService');

/**
 * Lista os eventos e envia a resposta HTTP.
 *
 * @param {import('express').Request} req - Requisição HTTP.
 * @param {import('express').Response} res - Resposta HTTP.
 * @returns {Promise<import('express').Response|void>} Resposta com os eventos ou erro.
 */
async function getAll(req, res) {
  try {
    const events = await eventService.listEvents();

    return res.status(200).json(events);
  } catch (error) {
    console.error('Erro ao listar eventos:', error.message);

    return res.status(500).json({
      message: 'Erro interno ao consultar os eventos.',
    });
  }
}

/**
 * Cadastra um evento.
 *
 * @param {import('express').Request} req - Requisição com os dados do evento.
 * @param {import('express').Response} res - Resposta HTTP.
 * @returns {Promise<import('express').Response|void>} Resposta com o evento criado ou erro.
 */
async function create(req, res) {
  try {
    const event = await eventService.createEvent(req.body);

    return res.status(201).json(event);
  } catch (error) {
    console.error('Erro ao cadastrar evento:', error.message);

    return res.status(error.statusCode || 500).json({
      message: error.statusCode
        ? error.message
        : 'Erro interno ao cadastrar evento.',
    });
  }
}

/**
 * Consulta um evento pelo identificador.
 *
 * @param {import('express').Request} req - Requisição com o ID nos parâmetros.
 * @param {import('express').Response} res - Resposta HTTP.
 * @returns {Promise<import('express').Response|void>} Resposta com o evento ou erro.
 */
async function getById(req, res) {
  try {
    const event = await eventService.getEventById(Number(req.params.id));

    return res.status(200).json(event);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.statusCode
        ? error.message
        : 'Erro interno ao consultar evento.',
    });
  }
}

/**
 * Atualiza um evento existente.
 *
 * @param {import('express').Request} req - Requisição com ID e dados atualizados.
 * @param {import('express').Response} res - Resposta HTTP.
 * @returns {Promise<import('express').Response|void>} Resposta com o evento atualizado ou erro.
 */
async function update(req, res) {
  try {
    const event = await eventService.updateEvent(
      Number(req.params.id),
      req.body,
    );

    return res.status(200).json(event);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.statusCode
        ? error.message
        : 'Erro interno ao atualizar evento.',
    });
  }
}

/**
 * Exclui um evento existente.
 *
 * @param {import('express').Request} req - Requisição com o ID do evento.
 * @param {import('express').Response} res - Resposta HTTP.
 * @returns {Promise<import('express').Response|void>} Resposta HTTP 204 ou erro.
 */
async function remove(req, res) {
  try {
    await eventService.deleteEvent(Number(req.params.id));

    return res.status(204).send();
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.statusCode
        ? error.message
        : 'Erro interno ao excluir evento.',
    });
  }
}

module.exports = {
  getAll,
  create,
  getById,
  update,
  remove,
};
