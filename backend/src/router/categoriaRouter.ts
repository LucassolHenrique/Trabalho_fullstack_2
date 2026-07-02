import { Router } from 'express';
import { CategoriaController } from '../controller/CategoriaController';

/**
 * @swagger
 * /categorias:
 *   get:
 *     summary: Listar todas as categorias
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorias
 *         content:
 *           application/json:
 *             example:
 *               - id: "550e8400-e29b-41d4-a716-446655440000"
 *                 nome: "Eletrônicos"
 *                 descricao: "Produtos eletrônicos em geral"
 *               - id: "660e8400-e29b-41d4-a716-446655440001"
 *                 nome: "Livros"
 *                 descricao: "Livros diversos"
 *       401:
 *         description: Não autorizado (token inválido ou ausente)
 *         content:
 *           application/json:
 *             example:
 *               message: "Token inválido ou expirado"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             example:
 *               message: "Erro ao buscar categorias"
 *   post:
 *     summary: Criar nova categoria
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome]
 *             properties:
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *           example:
 *             nome: "Roupas"
 *             descricao: "Vestuário em geral"
 *     responses:
 *       201:
 *         description: Categoria criada
 *         content:
 *           application/json:
 *             example:
 *               id: "770e8400-e29b-41d4-a716-446655440002"
 *               nome: "Roupas"
 *               descricao: "Vestuário em geral"
 *       400:
 *         description: Nome da categoria é obrigatório
 *         content:
 *           application/json:
 *             example:
 *               message: "Nome da categoria é obrigatório"
 *       401:
 *         description: Não autorizado
 *         content:
 *           application/json:
 *             example:
 *               message: "Token inválido ou expirado"
 *
 * /categorias/{id}:
 *   get:
 *     summary: Obter categoria por ID
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *         content:
 *           application/json:
 *             example:
 *               id: "550e8400-e29b-41d4-a716-446655440000"
 *               nome: "Eletrônicos"
 *               descricao: "Produtos eletrônicos em geral"
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Categoria não encontrada
 *         content:
 *           application/json:
 *             example:
 *               message: "Categoria não encontrada"
 *   put:
 *     summary: Atualizar categoria
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *           example:
 *             nome: "Eletrônicos Premium"
 *             descricao: "Eletrônicos de alta qualidade"
 *     responses:
 *       200:
 *         description: Categoria atualizada
 *         content:
 *           application/json:
 *             example:
 *               id: "550e8400-e29b-41d4-a716-446655440000"
 *               nome: "Eletrônicos Premium"
 *               descricao: "Eletrônicos de alta qualidade"
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             example:
 *               message: "Nome não pode estar vazio"
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Categoria não encontrada
 *   delete:
 *     summary: Deletar categoria
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       204:
 *         description: Categoria deletada com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Categoria não encontrada
 *         content:
 *           application/json:
 *             example:
 *               message: "Categoria não encontrada"
 */
export function createCategoriaRouter(categoriaController: CategoriaController, writeAuth: any): Router {
  const router = Router();

  router.get('/', (req, res) => categoriaController.getAllCategorias(req, res));
  router.get('/:id', (req, res) => categoriaController.getCategoriaById(req, res));
  router.post('/', writeAuth, (req, res) => categoriaController.createCategoria(req, res));
  router.put('/:id', writeAuth, (req, res) => categoriaController.updateCategoria(req, res));
  router.delete('/:id', writeAuth, (req, res) => categoriaController.deleteCategoria(req, res));

  return router;
}
