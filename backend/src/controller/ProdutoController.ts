import { Request, Response } from 'express';
import { ProdutoService } from '../service/ProdutoService';

export class ProdutoController {
  constructor(private produtoService: ProdutoService) {}

  async getAllProdutos(req: Request, res: Response): Promise<void> {
    try {
      const produtos = await this.produtoService.getAllProdutos();
      res.status(200).json(produtos);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getProdutoById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      const produto = await this.produtoService.getProdutoById(id);
      res.status(200).json(produto);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  async getProdutosByCategoria(req: Request, res: Response): Promise<void> {
    try {
      const { categoriaId } = req.params as { categoriaId: string };
      const produtos = await this.produtoService.getProdutosByCategoria(categoriaId);
      res.status(200).json(produtos);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  async createProduto(req: Request, res: Response): Promise<void> {
    try {
      const { nome, preco, categoriaId, descricao, estoque } = req.body;
      const produto = await this.produtoService.createProduto(
        nome,
        preco,
        categoriaId,
        descricao,
        estoque
      );
      res.status(201).json(produto);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateProduto(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      const { nome, preco, categoriaId, descricao, estoque } = req.body;
      const produto = await this.produtoService.updateProduto(
        id,
        nome,
        preco,
        categoriaId,
        descricao,
        estoque
      );
      res.status(200).json(produto);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteProduto(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      await this.produtoService.deleteProduto(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  async reajusteLote(req: Request, res: Response): Promise<void> {
    try {
      const { categoriaId, tipo, porcentagem } = req.body;
      const result = await this.produtoService.reajusteLote(categoriaId, tipo, Number(porcentagem));
      res.status(200).json({
        message: 'Preços dos produtos da categoria reajustados com sucesso!',
        ...result
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async ajustarEstoque(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      const { quantidade } = req.body;
      const produto = await this.produtoService.ajustarEstoque(id, Number(quantidade));
      res.status(200).json(produto);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
