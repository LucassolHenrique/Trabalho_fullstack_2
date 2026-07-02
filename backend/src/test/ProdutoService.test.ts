import test from 'node:test';
import assert from 'node:assert';
import { ProdutoService } from '../service/ProdutoService';
import { Produto } from '../model/Produto';
import { Categoria } from '../model/Categoria';

// Mock dos Repositories e Services dependentes
const mockProdutoRepository = {
  findAll: async () => [] as Produto[],
  findById: async (id: string) => {
    if (id === 'prod-123') {
      const prod = new Produto();
      prod.id = 'prod-123';
      prod.nome = 'Produto Teste';
      prod.preco = 100.00;
      prod.estoque = 10;
      prod.categoriaId = 'cat-123';
      return prod;
    }
    return null;
  },
  findByCategoria: async (categoriaId: string) => {
    if (categoriaId === 'cat-123') {
      const prod = new Produto();
      prod.id = 'prod-123';
      prod.nome = 'Produto Teste';
      prod.preco = 100.00;
      prod.estoque = 10;
      prod.categoriaId = 'cat-123';
      return [prod];
    }
    return [];
  },
  create: async (prod: Produto) => prod,
  update: async (id: string, updates: Partial<Produto>) => {
    const prod = new Produto();
    prod.id = id;
    prod.nome = 'Produto Teste';
    prod.preco = updates.preco !== undefined ? updates.preco : 100.00;
    prod.estoque = updates.estoque !== undefined ? updates.estoque : 10;
    prod.categoriaId = 'cat-123';
    return prod;
  },
  delete: async () => true,
};

const mockCategoriaService = {
  getAllCategorias: async () => [] as Categoria[],
  getCategoriaById: async (id: string) => {
    if (id === 'cat-123') {
      const cat = new Categoria();
      cat.id = 'cat-123';
      cat.nome = 'Eletrônicos';
      return cat;
    }
    throw new Error('Categoria não encontrada');
  },
  createCategoria: async (nome: string) => {
    const cat = new Categoria();
    cat.nome = nome;
    return cat;
  },
  updateCategoria: async (id: string) => {
    const cat = new Categoria();
    cat.id = id;
    return cat;
  },
  deleteCategoria: async () => true,
};

// Instanciando o ProdutoService com os mocks correspondentes
const service = new ProdutoService(
  mockProdutoRepository as any,
  mockCategoriaService as any
);

test('ProdutoService - Ajuste Rápido de Estoque', async (t) => {
  await t.test('Deve somar unidades ao estoque do produto corretamente', async () => {
    const result = await service.ajustarEstoque('prod-123', 5);
    assert.strictEqual(result?.estoque, 15); // 10 originais + 5 adicionados
  });

  await t.test('Deve falhar se o estoque final for menor que zero', async () => {
    await assert.rejects(
      async () => {
        await service.ajustarEstoque('prod-123', -15); // tenta tirar 15 de 10
      },
      /O estoque resultante não pode ser negativo/
    );
  });
});

test('ProdutoService - Reajuste de Preços em Lote', async (t) => {
  await t.test('Deve reajustar com desconto de 10% os preços da categoria', async () => {
    const result = await service.reajusteLote('cat-123', 'desconto', 10);
    assert.strictEqual(result.quantidadeAfetada, 1);
  });

  await t.test('Deve falhar se a categoria informada não existir', async () => {
    await assert.rejects(
      async () => {
        await service.reajusteLote('categoria-inexistente', 'aumento', 10);
      },
      /Categoria não encontrada/
    );
  });
});
