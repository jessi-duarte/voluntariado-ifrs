require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { testConnection } = require('./config/database');
const eventRoutes = require('./routes/eventRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const authRoutes = require('./routes/authRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
const { authenticateToken } = require('./middlewares/authMiddleware');
const app = express();

app.use(cors());

// Este middleware precisa vir antes das rotas!
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API de Voluntariado IFRS funcionando!',
  });
});

app.get('/dashboard', authenticateToken, (req, res) => {
  res.status(200).json({
    message: 'Acesso ao dashboard autorizado.',
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/events', eventRoutes);
app.use('/volunteers', volunteerRoutes);
app.use('/auth', authRoutes);

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    await testConnection();

    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar a aplicação:', error.message);
    process.exit(1);
  }
}

startServer();
