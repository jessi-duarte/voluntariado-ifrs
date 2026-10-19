const volunteerModel = require('../models/volunteerModel');

/**
 * Cria um erro com código HTTP associado.
 *
 * @param {string} message - Mensagem descritiva do erro.
 * @param {number} statusCode - Código HTTP do erro.
 * @returns {Error} Erro configurado com statusCode.
 */
function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

/**
 * Valida e normaliza os dados de um voluntário.
 *
 * @param {Object} data - Dados recebidos do voluntário.
 * @param {string} data.name - Nome do voluntário.
 * @param {string} data.email - E-mail do voluntário.
 * @param {string} [data.phone] - Telefone opcional.
 * @returns {{name: string, email: string, phone: string|null}} Dados validados.
 * @throws {Error} Erro 400 quando os dados são inválidos.
 */
function validateVolunteer(data) {
  const { name, email, phone } = data;

  if (
    typeof name !== 'string' ||
    !name.trim() ||
    typeof email !== 'string' ||
    !email.trim()
  ) {
    throw createError('Nome e e-mail são obrigatórios.', 400);
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw createError('Informe um e-mail válido.', 400);
  }

  if (phone !== undefined && phone !== null && typeof phone !== 'string') {
    throw createError('O telefone deve ser um texto.', 400);
  }

  return {
    name: name.trim(),
    email: normalizedEmail,
    phone: phone?.trim() || null,
  };
}

/**
 * Lista todos os voluntários cadastrados.
 *
 * @returns {Promise<Array<Object>>} Lista de voluntários.
 */
async function listVolunteers() {
  return volunteerModel.findAll();
}

/**
 * Busca um voluntário pelo identificador.
 *
 * @param {number} id - Identificador do voluntário.
 * @returns {Promise<Object>} Voluntário encontrado.
 * @throws {Error} Erro 404 quando o voluntário não existe.
 */
async function getVolunteerById(id) {
  const volunteer = await volunteerModel.findById(id);

  if (!volunteer) {
    throw createError('Voluntário não encontrado.', 404);
  }

  return volunteer;
}

/**
 * Valida e cadastra um novo voluntário.
 *
 * @param {Object} data - Dados do voluntário.
 * @param {string} data.name - Nome do voluntário.
 * @param {string} data.email - E-mail do voluntário.
 * @param {string} [data.phone] - Telefone opcional.
 * @returns {Promise<Object>} Voluntário cadastrado.
 * @throws {Error} Erro 400 quando os dados são inválidos.
 */
async function createVolunteer(data) {
  const volunteer = validateVolunteer(data);
  return volunteerModel.create(volunteer);
}

/**
 * Valida e atualiza um voluntário existente.
 *
 * @param {number} id - Identificador do voluntário.
 * @param {Object} data - Novos dados do voluntário.
 * @returns {Promise<Object|null>} Voluntário atualizado ou null.
 * @throws {Error} Erro 400 quando os dados são inválidos.
 * @throws {Error} Erro 404 quando o voluntário não existe.
 */
async function updateVolunteer(id, data) {
  await getVolunteerById(id);

  const volunteer = validateVolunteer(data);

  return volunteerModel.update(id, volunteer);
}

/**
 * Exclui um voluntário existente.
 *
 * @param {number} id - Identificador do voluntário.
 * @returns {Promise<boolean>} Indica se a exclusão foi realizada.
 * @throws {Error} Erro 404 quando o voluntário não existe.
 */
async function deleteVolunteer(id) {
  await getVolunteerById(id);
  return volunteerModel.remove(id);
}

module.exports = {
  listVolunteers,
  getVolunteerById,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
};
