import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Produto } from './Produto';

@Entity()
export class Categoria {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  nome!: string;

  @Column({ nullable: true })
  descricao?: string;

  @OneToMany(() => Produto, (produto) => produto.categoria)
  produtos!: Produto[];
}
