import { Request, Response } from 'express';
import { CategoriaService } from '../service/CategoriaService';

export class CategoriaController {
  constructor(private categoriaService: CategoriaService) {}

  async getAllCategorias(req: Request, res: Response): Promise<void> {
    try {
      const categorias = await this.categoriaService.getAllCategorias();
      res.status(200).json(categorias);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getCategoriaById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const categoria = await this.categoriaService.getCategoriaById(id);
      res.status(200).json(categoria);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  async createCategoria(req: Request, res: Response): Promise<void> {
    try {
      const { nome, descricao } = req.body;
      const categoria = await this.categoriaService.createCategoria(nome, descricao);
      res.status(201).json(categoria);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateCategoria(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { nome, descricao } = req.body;
      const categoria = await this.categoriaService.updateCategoria(id, nome, descricao);
      res.status(200).json(categoria);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteCategoria(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.categoriaService.deleteCategoria(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }
}
