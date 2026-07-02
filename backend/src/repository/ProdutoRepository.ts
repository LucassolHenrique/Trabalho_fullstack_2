import { Repository, DataSource } from 'typeorm';
import { Produto } from '../model/Produto';

export class ProdutoRepository {
  private repository: Repository<Produto>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(Produto);
  }

  async findAll(): Promise<Produto[]> {
    return this.repository.find({ relations: ['categoria'] });
  }

  async findById(id: string): Promise<Produto | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['categoria'],
    });
  }

  async findByCategoria(categoriaId: string): Promise<Produto[]> {
    return this.repository.find({
      where: { categoriaId },
      relations: ['categoria'],
    });
  }

  async create(produto: Produto): Promise<Produto> {
    return this.repository.save(produto);
  }

  async update(id: string, produto: Partial<Produto>): Promise<Produto | null> {
    await this.repository.update(id, produto);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
