import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '🚀 API Gerenciamento de Produtos e Categorias',
      version: '1.0.0',
      description: 'API RESTful com autenticação JWT, CRUDs completos e relacionamentos',
      contact: {
        name: 'Suporte',
        email: 'suporte@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor de Desenvolvimento',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/app.ts', './src/router/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
