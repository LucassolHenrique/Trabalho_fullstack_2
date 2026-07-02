import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Categoria } from './Categoria';

@Entity()
export class Produto {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  nome!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  preco!: number;

  @Column({ nullable: true })
  descricao?: string;

  @Column({ default: 0 })
  estoque!: number;

  @ManyToOne(() => Categoria, (categoria) => categoria.produtos)
  @JoinColumn({ name: 'categoriaId' })
  categoria!: Categoria;

  @Column({ nullable: true })
  categoriaId?: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  dataCriacao!: Date;
}
