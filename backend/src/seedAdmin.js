require('dotenv').config();

const bcrypt = require('bcryptjs');
const authModel = require('./models/authModel');
const { pool } = require('./config/database');

async function seedAdmin() {
  try {
    const name = process.env.ADMIN_NAME;
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!name || !email || !password) {
      throw new Error(
        'Configure ADMIN_NAME, ADMIN_EMAIL e ADMIN_PASSWORD no .env.',
      );
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('Configure JWT_SECRET no .env.');
    }

    const existingUser = await authModel.findByEmail(email);

    if (existingUser) {
      console.log(
        'Este e-mail já está cadastrado. Nenhuma alteração foi feita.',
      );
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await authModel.create({
      name,
      email,
      passwordHash,
      role: 'admin',
    });

    console.log(`Administrador criado com ID ${user.id}.`);
  } catch (error) {
    console.error('Erro ao criar administrador:', error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seedAdmin();
