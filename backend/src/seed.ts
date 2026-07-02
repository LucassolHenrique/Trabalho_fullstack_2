import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Categoria } from './model/Categoria';
import { Produto } from './model/Produto';
import { Usuario } from './model/Usuario';
import bcryptjs from 'bcryptjs';

// Dados de exemplo para popular o banco de dados
const dataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true,
  logging: false,
  entities: [Categoria, Produto, Usuario],
  migrations: [],
  subscribers: [],
});

async function seedDatabase() {
  try {
    await dataSource.initialize();
    console.log('Conectado ao banco de dados');

    const categoriaRepository = dataSource.getRepository(Categoria);
    const produtoRepository = dataSource.getRepository(Produto);
    const usuarioRepository = dataSource.getRepository(Usuario);

    // Limpar dados existentes
    await produtoRepository.clear();
    await categoriaRepository.clear();
    await usuarioRepository.clear();

    // Criar usuários de teste
    const senhaHash1 = await bcryptjs.hash('senha123', 10);
    const senhaHash2 = await bcryptjs.hash('senha456', 10);
    const senhaHash3 = await bcryptjs.hash('senha789', 10);

    const usuario1 = usuarioRepository.create({
      email: 'admin@example.com',
      senha: senhaHash1,
      isAdmin: true,
      role: 'admin',
    });

    const usuario2 = usuarioRepository.create({
      email: 'operador@example.com',
      senha: senhaHash2,
      isAdmin: false,
      role: 'operador',
    });

    const usuario3 = usuarioRepository.create({
      email: 'visualizador@example.com',
      senha: senhaHash3,
      isAdmin: false,
      role: 'visualizador',
    });

    await usuarioRepository.save([usuario1, usuario2, usuario3]);
    console.log('✅ Usuários criados (admin / operador / visualizador)');

    // Criar categorias
    const categoria1 = categoriaRepository.create({
      nome: 'Eletrônicos',
      descricao: 'Produtos eletrônicos em geral',
    });

    const categoria2 = categoriaRepository.create({
      nome: 'Livros',
      descricao: 'Livros de diversos gêneros',
    });

    const categoria3 = categoriaRepository.create({
      nome: 'Roupas',
      descricao: 'Roupas e acessórios',
    });

    await categoriaRepository.save([categoria1, categoria2, categoria3]);
    console.log('✅ Categorias criadas');

    // Criar produtos
    const produtos = [
      {
        nome: 'Notebook Dell',
        preco: 3500.00,
        descricao: 'Notebook de alto desempenho com processador i7',
        estoque: 5,
        categoria: categoria1,
      },
      {
        nome: 'Mouse Wireless',
        preco: 89.90,
        descricao: 'Mouse sem fio com bateria de longa duração',
        estoque: 20,
        categoria: categoria1,
      },
      {
        nome: 'Teclado Mecânico',
        preco: 450.00,
        descricao: 'Teclado mecânico RGB com switches cherry',
        estoque: 10,
        categoria: categoria1,
      },
      {
        nome: 'Clean Code',
        preco: 95.00,
        descricao: 'Livro sobre boas práticas de programação',
        estoque: 15,
        categoria: categoria2,
      },
      {
        nome: 'O Programador Pragmático',
        preco: 85.00,
        descricao: 'Guia essencial para programadores profissionais',
        estoque: 12,
        categoria: categoria2,
      },
      {
        nome: 'Camiseta Básica',
        preco: 49.90,
        descricao: 'Camiseta de algodão básica',
        estoque: 50,
        categoria: categoria3,
      },
      {
        nome: 'Calça Jeans',
        preco: 129.90,
        descricao: 'Calça jeans azul escuro',
        estoque: 30,
        categoria: categoria3,
      },
    ];

    const produtosCriados = produtoRepository.create(produtos);
    await produtoRepository.save(produtosCriados);
    console.log('✅ Produtos criados');

    console.log('\n✅ Banco de dados populado com sucesso!');
    console.log('\nUsuários de teste:');
    console.log('- Email: admin@example.com        | Senha: senha123 | Cargo: Admin (Pode tudo)');
    console.log('- Email: operador@example.com     | Senha: senha456 | Cargo: Operador (Pode modificar produtos/cat)');
    console.log('- Email: visualizador@example.com | Senha: senha789 | Cargo: Visualizador (Apenas leitura)');
    console.log('\nCategorias:');
    console.log('- Eletrônicos');
    console.log('- Livros');
    console.log('- Roupas');
    console.log('\nProdutos inseridos: 7');

    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Erro ao popular banco de dados:', error);
    process.exit(1);
  }
}

seedDatabase();
