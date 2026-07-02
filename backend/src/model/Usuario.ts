import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  senha!: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  dataCriacao!: Date;
}
