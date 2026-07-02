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
 * 
 * /usuarios/{id}/role:
 *   patch:
 *     summary: Alterar cargo/função de um usuário (Apenas Administradores)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         example: "2"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [admin, operador, visualizador]
 *           example:
 *             role: "operador"
 *     responses:
 *       200:
 *         description: Cargo alterado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               message: "Cargo de user@example.com alterado para \"operador\" com sucesso!"
 *               usuario:
 *                 id: 2
 *                 email: "user@example.com"
 *                 role: "operador"
 *                 isAdmin: false
 *       400:
 *         description: Cargo inválido ou tentativa de lockout (alterar próprio cargo)
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso negado (apenas administradores)
 *       404:
 *         description: Usuário não encontrado
 */
export function createUsuarioRouter(usuarioController: UsuarioController): Router {
  const router = Router();

  router.get('/', (req, res) => usuarioController.listar(req, res));
  router.patch('/:id/role', (req, res) => usuarioController.alterarCargo(req, res));

  return router;
}
