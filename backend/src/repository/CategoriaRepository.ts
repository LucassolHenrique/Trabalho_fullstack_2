import { Repository, DataSource } from 'typeorm';
import { Categoria } from '../model/Categoria';

export class CategoriaRepository {
  private repository: Repository<Categoria>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(Categoria);
  }

  async findAll(): Promise<Categoria[]> {
    return this.repository.find({ relations: ['produtos'] });
  }

  async findById(id: string): Promise<Categoria | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['produtos'],
    });
  }

  async create(categoria: Categoria): Promise<Categoria> {
    return this.repository.save(categoria);
  }

  async update(id: string, categoria: Partial<Categoria>): Promise<Categoria | null> {
    await this.repository.update(id, categoria);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
