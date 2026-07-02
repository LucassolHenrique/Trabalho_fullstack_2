import { Router } from 'express';
import { AuthController } from '../controller/AuthController';

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar novo usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, senha]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               senha:
 *                 type: string
 *           example:
 *             email: "novouser@example.com"
 *             senha: "senha123"
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               message: "Usuário cadastrado com sucesso"
 *               usuario:
 *                 id: "550e8400-e29b-41d4-a716-446655440000"
 *                 email: "novouser@example.com"
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Email ou senha vazios
 *         content:
 *           application/json:
 *             example:
 *               message: "Email e senha são obrigatórios"
 *       409:
 *         description: Email já cadastrado
 *         content:
 *           application/json:
 *             example:
 *               message: "Email já cadastrado"
 *
 * /auth/login:
 *   post:
 *     summary: Fazer login e obter token JWT
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, senha]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               senha:
 *                 type: string
 *           example:
 *             email: "admin@example.com"
 *             senha: "senha123"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               message: "Login realizado com sucesso"
 *               usuario:
 *                 id: "6cdda80e-164d-44f8-b0da-ee0fc39d65ba"
 *                 email: "admin@example.com"
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Email ou senha não fornecidos
 *         content:
 *           application/json:
 *             example:
 *               message: "Email e senha são obrigatórios"
 *       401:
 *         description: Email ou senha incorretos
 *         content:
 *           application/json:
 *             example:
 *               message: "Email ou senha incorretos"
 */
export function createAuthRouter(authController: AuthController): Router {
  const router = Router();

  router.post('/register', (req, res) => authController.register(req, res));
  router.post('/login', (req, res) => authController.login(req, res));

  return router;
}
