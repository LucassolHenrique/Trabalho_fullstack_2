import 'reflect-metadata';
import express from 'express';
// import swaggerUi from 'swagger-ui-express';
import { DataSource } from 'typeorm';
import { Categoria } from './model/Categoria';
import { Produto } from './model/Produto';
import { Usuario } from './model/Usuario';
import { CategoriaRepository } from './repository/CategoriaRepository';
import { ProdutoRepository } from './repository/ProdutoRepository';
import { CategoriaService } from './service/CategoriaService';
import { ProdutoService } from './service/ProdutoService';
import { AuthService } from './service/AuthService';
import { CategoriaController } from './controller/CategoriaController';
import { ProdutoController } from './controller/ProdutoController';
import { AuthController } from './controller/AuthController';
import { createCategoriaRouter } from './router/categoriaRouter';
import { createProdutoRouter } from './router/produtoRouter';
import { createAuthRouter } from './router/authRouter';
import { createUsuarioRouter } from './router/usuarioRouter';
import { UsuarioController } from './controller/UsuarioController';
import { authenticateToken } from './middleware/authenticateToken';
import { authorizeRole } from './middleware/authorizeRole';
// import { swaggerSpec } from './config/swagger';

// Configuração do DataSource (banco de dados)
const appDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true,
  logging: false,
  entities: [Categoria, Produto, Usuario],
  migrations: [],
  subscribers: [],
});

// Inicialização da aplicação
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { swaggerOptions: { persistAuthorization: true } }));

// Rotas de saúde
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'API está funcionando corretamente!' });
});

// Inicializar banco de dados e rotas
appDataSource
  .initialize()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso!');

    // Instanciar repositories
    const categoriaRepository = new CategoriaRepository(appDataSource);
    const produtoRepository = new ProdutoRepository(appDataSource);

    // Instanciar services
    const categoriaService = new CategoriaService(categoriaRepository);
    const produtoService = new ProdutoService(produtoRepository, categoriaService);
    const authService = new AuthService(appDataSource);

    // Instanciar controllers
    const categoriaController = new CategoriaController(categoriaService);
    const produtoController = new ProdutoController(produtoService);
    const authController = new AuthController(authService);
    const usuarioController = new UsuarioController(appDataSource);

    // Rotas públicas (sem autenticação)
    app.use('/api/auth', createAuthRouter(authController));

    // Rotas protegidas (com autenticação)
    const writeAuth = authorizeRole(['admin', 'operador'], appDataSource);
    const adminAuth = authorizeRole(['admin'], appDataSource);

    app.use('/api/categorias', authenticateToken, createCategoriaRouter(categoriaController, writeAuth));
    app.use('/api/produtos', authenticateToken, createProdutoRouter(produtoController, writeAuth));
    app.use('/api/usuarios', authenticateToken, adminAuth, createUsuarioRouter(usuarioController));

    // Rota raiz
    app.get('/', (req, res) => {
      res.status(200).json({
        message: 'API de Gerenciamento de Produtos e Categorias',
        version: '1.0.0',
        endpoints: {
          health: 'GET /api/health',
          categorias: {
            listar: 'GET /api/categorias',
            obter: 'GET /api/categorias/:id',
            criar: 'POST /api/categorias',
            atualizar: 'PUT /api/categorias/:id',
            deletar: 'DELETE /api/categorias/:id',
          },
          produtos: {
            listar: 'GET /api/produtos',
            obter: 'GET /api/produtos/:id',
            porCategoria: 'GET /api/produtos/categoria/:categoriaId',
            criar: 'POST /api/produtos',
            atualizar: 'PUT /api/produtos/:id',
            deletar: 'DELETE /api/produtos/:id',
          },
        },
      });
    });

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao conectar com o banco de dados:', error);
    process.exit(1);
  });

export default app;
