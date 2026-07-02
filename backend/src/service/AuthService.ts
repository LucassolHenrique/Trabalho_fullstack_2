import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { Usuario } from '../model/Usuario';
import { Repository, DataSource } from 'typeorm';

const JWT_SECRET = process.env.JWT_SECRET || 'seu_secret_super_seguro_aqui_123456';

export class AuthService {
  private usuarioRepository: Repository<Usuario>;

  constructor(dataSource: DataSource) {
    this.usuarioRepository = dataSource.getRepository(Usuario);
  }

  async register(email: string, senha: string): Promise<{ usuario: Usuario; token: string }> {
    if (!email || !senha) {
      throw new Error('Email e senha são obrigatórios');
    }

    const usuarioExistente = await this.usuarioRepository.findOne({ where: { email } });
    if (usuarioExistente) {
      throw new Error('Email já cadastrado');
    }

    const senhaHash = await bcryptjs.hash(senha, 10);
    const usuario = this.usuarioRepository.create({
      email,
      senha: senhaHash,
    });

    const usuarioSalvo = await this.usuarioRepository.save(usuario);
    const token = this.gerarToken(usuarioSalvo.id);

    return { usuario: usuarioSalvo, token };
  }

  async login(email: string, senha: string): Promise<{ usuario: Usuario; token: string }> {
    if (!email || !senha) {
      throw new Error('Email e senha são obrigatórios');
    }

    const usuario = await this.usuarioRepository.findOne({ where: { email } });
    if (!usuario) {
      throw new Error('Email ou senha incorretos');
    }

    const senhaValida = await bcryptjs.compare(senha, usuario.senha);
    if (!senhaValida) {
      throw new Error('Email ou senha incorretos');
    }

    const token = this.gerarToken(usuario.id);
    return { usuario, token };
  }

  private gerarToken(usuarioId: number): string {
    return jwt.sign({ id: usuarioId }, JWT_SECRET, { expiresIn: '24h' });
  }

  validateToken(token: string): { id: number } {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
      return decoded;
    } catch (error) {
      throw new Error('Token inválido ou expirado');
    }
  }
}
