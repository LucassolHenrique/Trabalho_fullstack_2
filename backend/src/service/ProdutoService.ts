import { Produto } from '../model/Produto';
import { ProdutoRepository } from '../repository/ProdutoRepository';
import { CategoriaService } from './CategoriaService';

export class ProdutoService {
  constructor(
    private produtoRepository: ProdutoRepository,
    private categoriaService: CategoriaService
  ) {}

  async getAllProdutos(): Promise<Produto[]> {
    return this.produtoRepository.findAll();
  }

  async getProdutoById(id: string): Promise<Produto | null> {
    const produto = await this.produtoRepository.findById(id);
    if (!produto) {
      throw new Error('Produto não encontrado');
    }
    return produto;
  }

  async getProdutosByCategoria(categoriaId: string): Promise<Produto[]> {
    // Valida se a categoria existe
    await this.categoriaService.getCategoriaById(categoriaId);
    return this.produtoRepository.findByCategoria(categoriaId);
  }

  async createProduto(
    nome: string,
    preco: number,
    categoriaId: string,
    descricao?: string,
    estoque?: number
  ): Promise<Produto> {
    // Validações
    if (!nome || nome.trim() === '') {
      throw new Error('Nome do produto é obrigatório');
    }
    if (preco <= 0) {
      throw new Error('Preço deve ser maior que zero');
    }
    if (!categoriaId || categoriaId.trim() === '') {
      throw new Error('Categoria é obrigatória');
    }

    // Valida se a categoria existe
    await this.categoriaService.getCategoriaById(categoriaId);

    const produto = new Produto();
    produto.nome = nome;
    produto.preco = preco;
    produto.descricao = descricao;
    produto.estoque = estoque || 0;
    produto.categoriaId = categoriaId;

    return this.produtoRepository.create(produto);
  }

  async updateProduto(
    id: string,
    nome?: string,
    preco?: number,
    categoriaId?: string,
    descricao?: string,
    estoque?: number
  ): Promise<Produto | null> {
    const produto = await this.produtoRepository.findById(id);
    if (!produto) {
      throw new Error('Produto não encontrado');
    }

    // Validações
    if (preco !== undefined && preco <= 0) {
      throw new Error('Preço deve ser maior que zero');
    }
    if (categoriaId && categoriaId.trim() === '') {
      throw new Error('Categoria inválida');
    }

    // Valida se a nova categoria existe
    if (categoriaId && categoriaId !== produto.categoriaId) {
      await this.categoriaService.getCategoriaById(categoriaId);
    }

    const updates: Partial<Produto> = {};
    if (nome !== undefined) updates.nome = nome;
    if (preco !== undefined) updates.preco = preco;
    if (descricao !== undefined) updates.descricao = descricao;
    if (estoque !== undefined) updates.estoque = estoque;
    if (categoriaId !== undefined) updates.categoriaId = categoriaId;

    return this.produtoRepository.update(id, updates);
  }

  async deleteProduto(id: string): Promise<boolean> {
    const produto = await this.produtoRepository.findById(id);
    if (!produto) {
      throw new Error('Produto não encontrado');
    }

    return this.produtoRepository.delete(id);
  }

  async reajusteLote(
    categoriaId: string,
    tipo: 'aumento' | 'desconto',
    porcentagem: number
  ): Promise<{ quantidadeAfetada: number }> {
    if (!categoriaId) {
      throw new Error('Categoria é obrigatória');
    }
    if (porcentagem <= 0) {
      throw new Error('Porcentagem deve ser maior que zero');
    }
    if (tipo !== 'aumento' && tipo !== 'desconto') {
      throw new Error('Tipo de reajuste inválido');
    }

    // Valida se a categoria existe
    await this.categoriaService.getCategoriaById(categoriaId);

    const produtos = await this.produtoRepository.findByCategoria(categoriaId);
    
    for (const produto of produtos) {
      let novoPreco = produto.preco;
      if (tipo === 'aumento') {
        novoPreco = Number((produto.preco * (1 + porcentagem / 100)).toFixed(2));
      } else {
        novoPreco = Number((produto.preco * (1 - porcentagem / 100)).toFixed(2));
      }

      if (novoPreco <= 0) {
        throw new Error(`O reajuste faria com que o produto "${produto.nome}" ficasse com preço menor ou igual a zero`);
      }

      await this.produtoRepository.update(produto.id, { preco: novoPreco });
    }

    return { quantidadeAfetada: produtos.length };
  }

  async ajustarEstoque(id: string, quantidade: number): Promise<Produto | null> {
    const produto = await this.produtoRepository.findById(id);
    if (!produto) {
      throw new Error('Produto não encontrado');
    }

    const novoEstoque = produto.estoque + quantidade;
    if (novoEstoque < 0) {
      throw new Error('O estoque resultante não pode ser negativo');
    }

    return this.produtoRepository.update(id, { estoque: novoEstoque });
  }
}
