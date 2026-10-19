# Voluntariado IFRS

Aplicação web acadêmica para divulgar e administrar oportunidades de voluntariado, com eventos sociais e gerenciamento de voluntários.

O projeto utiliza React no frontend, Node.js com Express no backend e MySQL para persistência de dados. A API está organizada em camadas de rotas, controladores, serviços e modelos, e utiliza JWT para proteger operações administrativas.

## Tecnologias

- **Frontend:** React, Vite e CSS
- **Backend:** Node.js e Express
- **Banco de dados:** MySQL
- **Autenticação:** JWT
- **Senha do administrador:** hash com bcrypt
- **Testes manuais da API:** REST Client para VS Code (`tests.rest`)
- **Qualidade de código no frontend:** ESLint

## Estrutura do projeto

voluntariado-ifrs/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuração da conexão com o banco
│   │   ├── controllers/    # Recebe requisições e devolve respostas
│   │   ├── middlewares/    # Autenticação e autorização
│   │   ├── models/         # Consultas e operações no banco
│   │   ├── routes/         # Rotas da API
│   │   ├── services/       # Regras de negócio e validações
│   │   ├── seedAdmin.js    # Criação inicial do administrador
│   │   └── server.js       # Inicialização da API
│   ├── .env                # Configurações locais (não versionar)
│   └── package.json
├── frontend/
│   ├── src/
│   └── package.json
├── tests.rest              # Exemplos de requisições HTTP
└── README.md
```

## Pré-requisitos

Instale e configure:

- Node.js e npm
- MySQL Server
- Visual Studio Code
- Extensão **REST Client** do VS Code (para executar `tests.rest`)

## 1. Configurar o banco de dados

1. Inicie o MySQL.
2. Crie o banco de dados `voluntariado_ifrs` caso ele ainda não exista.
3. Execute o script SQL de criação das tabelas e dados fictícios fornecido com a entrega, quando disponível.
4. Confira os nomes das tabelas e colunas usados pelo backend.

> Observação: o arquivo SQL de entrega deve ser mantido na raiz do projeto e incluir a estrutura necessária para executar a aplicação. Ajuste esta seção se o nome final do script for diferente.

## 2. Configurar as variáveis de ambiente do backend

Na pasta `backend`, crie ou edite o arquivo `.env` com as configurações do seu ambiente. Use os nomes de variáveis que o código espera:

```env
DB_HOST=localhost
DB_USER=SEU_USUARIO_MYSQL
DB_PASSWORD=SUA_SENHA_MYSQL
DB_NAME=voluntariado_ifrs

JWT_SECRET=COLOQUE_UMA_CHAVE_ALEATORIA_LONGA
ADMIN_NAME=Administrador
ADMIN_EMAIL=admin@voluntariado.local
ADMIN_PASSWORD=DEFINA_UMA_SENHA_FORTE
```

Os nomes das variáveis de conexão devem ser conferidos em `backend/src/config/database.js`. Se o arquivo usar nomes diferentes, mantenha os nomes esperados pelo código.

**Segurança:**
- Não envie o arquivo `.env` ao GitHub nem o inclua no ZIP de entrega.
- Não compartilhe a chave `JWT_SECRET` ou a senha do banco.
- Gere uma chave JWT aleatória e longa; não mantenha o texto de exemplo acima.
- Use senhas próprias para o seu ambiente.

## 3. Instalar as dependências

Abra um terminal na raiz do projeto e execute:

```powershell
cd backend
npm install
cd ../frontend
npm install
```

## 4. Criar o administrador inicial

Depois de configurar o banco e o `.env`, abra um terminal na pasta `backend` e execute:

```powershell
node src/seedAdmin.js
```

O script cria o administrador com as variáveis `ADMIN_NAME`, `ADMIN_EMAIL` e `ADMIN_PASSWORD`. Se o e-mail já estiver cadastrado, o script informa que não realizou alterações.

## 5. Iniciar a aplicação

É necessário manter o backend e o frontend em execução em terminais separados.

### Terminal 1 — Backend

```powershell
cd backend
npm run dev
```

O script de desenvolvimento usa Nodemon. Para iniciar sem o Nodemon, use `npm start`.

A API é configurada para ser acessada em `http://localhost:3000`, conforme os exemplos do arquivo `tests.rest`.

### Terminal 2 — Frontend

```powershell
cd frontend
npm run dev
```

Abra no navegador o endereço informado pelo Vite no terminal, normalmente `http://localhost:5173`.

## Autenticação e autorização

A API disponibiliza a rota `POST /auth/login` para autenticar o administrador. Em caso de sucesso, a resposta inclui um token JWT.

As operações administrativas de criação, atualização e exclusão exigem um token válido e permissão de administrador. Envie o token no cabeçalho HTTP:

A rota GET /dashboard exige um token JWT válido e retorna informações básicas do usuário autenticado. As operações administrativas exigem também o papel admin.

```http
Authorization: Bearer SEU_TOKEN_JWT
```

Não utilize tokens antigos após trocar o `JWT_SECRET`: faça login novamente para obter um token válido.

## Rotas principais da API

| Método | Rota | Finalidade |
|---|---|---|
| `GET` | `/dashboard` | Consultar dashboard (usuário autenticado) |
| `POST` | `/auth/login` | Autenticar e obter token |
| `GET` | `/events` | Listar eventos |
| `GET` | `/events/:id` | Consultar evento por ID |
| `POST` | `/events` | Cadastrar evento (administrador) |
| `PUT` | `/events/:id` | Atualizar evento (administrador) |
| `DELETE` | `/events/:id` | Excluir evento (administrador) |
| `GET` | `/volunteers` | Listar voluntários |
| `GET` | `/volunteers/:id` | Consultar voluntário por ID |
| `POST` | `/volunteers` | Cadastrar voluntário (administrador) |
| `PUT` | `/volunteers/:id` | Atualizar voluntário (administrador) |
| `DELETE` | `/volunteers/:id` | Excluir voluntário (administrador) |

A disponibilidade e os requisitos de autenticação de cada rota são definidos nos arquivos de rotas do backend.

## Testar a API

1. Instale a extensão **REST Client** no VS Code.
2. Abra `tests.rest`.
3. Inicie o backend e o MySQL.
4. Execute primeiro a requisição de login.
5. Copie o token retornado e substitua `COLE_O_TOKEN_NOVO_AQUI` nas requisições protegidas.
6. Execute as requisições individualmente.

O teste de cadastro sem token deve continuar sem o cabeçalho `Authorization`, pois verifica se a API bloqueia acesso não autenticado.

Antes de executar requisições de exclusão, confirme que o ID é de um registro de teste.

## Verificação do frontend

Na pasta `frontend`, os comandos disponíveis são:

```powershell
npm run lint
npm run build
```

- `npm run lint`: executa o ESLint.
- `npm run build`: gera a versão de produção do frontend.

## Limitações e observações

- A aplicação é um projeto acadêmico executado localmente.
- As operações disponíveis e o nível de implementação devem ser confirmados na aplicação em execução e nos testes.
- Não declare como implementada uma funcionalidade que não tenha sido verificada.
- Se houver funcionalidades não implementadas, descreva-as claramente na apresentação e no vídeo.

## Entregáveis

Antes de compactar o projeto, confira se a pasta contém:

- Código-fonte do backend e frontend.
- Script SQL com criação das tabelas e dados fictícios.
- Arquivo `tests.rest`.
- Este `README.md`.
- Arquivo `.txt` com o link do vídeo explicativo.
- Link do repositório GitHub, conforme solicitado na atividade.

Não inclua `node_modules`, credenciais reais, tokens JWT ou o arquivo `.env` no ZIP de entrega.
