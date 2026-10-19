const volunteerService = require('../services/volunteerService');

/**
 * Converte e valida um identificador recebido pela rota.
 *
 * @param {string} value - Valor do identificador recebido na URL.
 * @returns {number} Identificador inteiro positivo.
 * @throws {Error} Erro 400 quando o identificador é inválido.
 */
function parseId(value) {
  const id = Number(value);

  if (!Number.isSafeInteger(id) || id <= 0) {
    const error = new Error('ID inválido.');
    error.statusCode = 400;
    throw error;
  }

  return id;
}

/**
 * Trata erros e envia a resposta HTTP apropriada.
 *
 * @param {import('express').Response} res - Resposta HTTP.
 * @param {Error & {statusCode?: number, code?: string}} error - Erro ocorrido.
 * @param {string} defaultMessage - Mensagem para erros inesperados.
 * @returns {import('express').Response} Resposta HTTP com a mensagem do erro.
 */
function handleError(res, error, defaultMessage) {
  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      message: 'Este e-mail já está cadastrado.',
    });
  }

  return res.status(error.statusCode || 500).json({
    message: error.statusCode ? error.message : defaultMessage,
  });
}

/**
 * Lista os voluntários cadastrados.
 *
 * @param {import('express').Request} req - Requisição HTTP.
 * @param {import('express').Response} res - Resposta HTTP.
 * @returns {Promise<void>} Envia a lista de voluntários ou uma mensagem de erro.
 */
async function getAll(req, res) {
  try {
    const volunteers = await volunteerService.listVolunteers();
    return res.status(200).json(volunteers);
  } catch (error) {
    console.error(error);
    return handleError(res, error, 'Erro interno ao listar voluntários.');
  }
}

/**
 * Consulta um voluntário pelo identificador.
 *
 * @param {import('express').Request} req - Requisição com o ID na URL.
 * @param {import('express').Response} res - Resposta HTTP.
 * @returns {Promise<void>} Envia o voluntário encontrado ou uma mensagem de erro.
 */
async function getById(req, res) {
  try {
    const id = parseId(req.params.id);
    const volunteer = await volunteerService.getVolunteerById(id);

    return res.status(200).json(volunteer);
  } catch (error) {
    return handleError(res, error, 'Erro interno ao consultar voluntário.');
  }
}

/**
 * Cadastra um novo voluntário.
 *
 * @param {import('express').Request} req - Requisição com os dados no corpo.
 * @param {import('express').Response} res - Resposta HTTP.
 * @returns {Promise<void>} Envia o voluntário criado ou uma mensagem de erro.
 */
async function create(req, res) {
  try {
    const volunteer = await volunteerService.createVolunteer(req.body);

    return res.status(201).json(volunteer);
  } catch (error) {
    return handleError(res, error, 'Erro interno ao cadastrar voluntário.');
  }
}

/**
 * Atualiza os dados de um voluntário.
 *
 * @param {import('express').Request} req - Requisição com ID e dados atualizados.
 * @param {import('express').Response} res - Resposta HTTP.
 * @returns {Promise<void>} Envia o voluntário atualizado ou uma mensagem de erro.
 */
async function update(req, res) {
  try {
    const id = parseId(req.params.id);

    const volunteer = await volunteerService.updateVolunteer(id, req.body);

    return res.status(200).json(volunteer);
  } catch (error) {
    return handleError(res, error, 'Erro interno ao atualizar voluntário.');
  }
}

/**
 * Exclui um voluntário pelo identificador.
 *
 * @param {import('express').Request} req - Requisição com o ID na URL.
 * @param {import('express').Response} res - Resposta HTTP.
 * @returns {Promise<void>} Envia status 204 ou uma mensagem de erro.
 */
async function remove(req, res) {
  try {
    const id = parseId(req.params.id);

    await volunteerService.deleteVolunteer(id);

    return res.status(204).send();
  } catch (error) {
    return handleError(res, error, 'Erro interno ao excluir voluntário.');
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
