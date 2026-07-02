import { Router } from 'express';
import { UsuarioController } from '../controller/UsuarioController';

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Listar todos os usuários (Apenas Administradores)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários carregada com sucesso
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 email: "admin@example.com"
 *                 isAdmin: true
 *                 dataCriacao: "2026-07-01T22:20:45.000Z"
 *               - id: 2
 *                 email: "user@example.com"
 *                 isAdmin: false
 *                 dataCriacao: "2026-07-01T22:20:45.000Z"
 *       401:
 *         description: Não autenticado (Token JWT inválido ou ausente)
 *       403:
 *         description: Não autorizado (O usuário não é administrador)
 *       500:
 *         description: Erro interno do servidor
 */
export function createUsuarioRouter(usuarioController: UsuarioController): Router {
  const router = Router();

  router.get('/', (req, res) => usuarioController.listar(req, res));
  router.patch('/:id/role', (req, res) => usuarioController.alterarCargo(req, res));

  return router;
}
