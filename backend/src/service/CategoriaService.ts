import { Categoria } from '../model/Categoria';
import { CategoriaRepository } from '../repository/CategoriaRepository';

export class CategoriaService {
  constructor(private categoriaRepository: CategoriaRepository) {}

  async getAllCategorias(): Promise<Categoria[]> {
    return this.categoriaRepository.findAll();
  }

  async getCategoriaById(id: string): Promise<Categoria | null> {
    const categoria = await this.categoriaRepository.findById(id);
    if (!categoria) {
      throw new Error('Categoria não encontrada');
    }
    return categoria;
  }

  async createCategoria(nome: string, descricao?: string): Promise<Categoria> {
    if (!nome || nome.trim() === '') {
      throw new Error('Nome da categoria é obrigatório');
    }

    const categoria = new Categoria();
    categoria.nome = nome;
    categoria.descricao = descricao;

    return this.categoriaRepository.create(categoria);
  }

  async updateCategoria(id: string, nome?: string, descricao?: string): Promise<Categoria | null> {
    const categoria = await this.categoriaRepository.findById(id);
    if (!categoria) {
      throw new Error('Categoria não encontrada');
    }

    const updates: Partial<Categoria> = {};
    if (nome !== undefined) updates.nome = nome;
    if (descricao !== undefined) updates.descricao = descricao;

    return this.categoriaRepository.update(id, updates);
  }

  async deleteCategoria(id: string): Promise<boolean> {
    const categoria = await this.categoriaRepository.findById(id);
    if (!categoria) {
      throw new Error('Categoria não encontrada');
    }

    return this.categoriaRepository.delete(id);
  }
}
