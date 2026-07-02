import { Response } from 'express';
import { DataSource, Repository } from 'typeorm';
import { Usuario } from '../model/Usuario';
import { AuthRequest } from '../middleware/authenticateToken';

export class UsuarioController {
  private usuarioRepository: Repository<Usuario>;

  constructor(dataSource: DataSource) {
    this.usuarioRepository = dataSource.getRepository(Usuario);
  }

  async listar(req: AuthRequest, res: Response): Promise<void> {
    try {
      const usuarioId = req.usuarioId;

      if (!usuarioId) {
        res.status(401).json({ message: 'Não autenticado' });
        return;
      }

      // Buscar o usuário que está fazendo a requisição para verificar se é admin
      const solicitante = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
      
      if (!solicitante || !solicitante.isAdmin) {
        res.status(403).json({ message: 'Acesso negado: apenas administradores podem visualizar esta página.' });
        return;
      }

      // Buscar todos os usuários do sistema
      const usuarios = await this.usuarioRepository.find({
        order: { dataCriacao: 'DESC' }
      });

      // Retornar os usuários ocultando suas senhas
      const usuariosResponse = usuarios.map(u => ({
        id: u.id,
        email: u.email,
        isAdmin: u.isAdmin,
        role: u.role,
        dataCriacao: u.dataCriacao
      }));

      res.status(200).json(usuariosResponse);
    } catch (error: any) {
      res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
  }

  async alterarCargo(req: AuthRequest, res: Response): Promise<void> {
    try {
      const usuarioId = req.usuarioId;
      const { id } = req.params;
      const { role } = req.body;

      if (!usuarioId) {
        res.status(401).json({ message: 'Não autenticado' });
        return;
      }

      // Validar cargo
      const cargosValidos = ['admin', 'operador', 'visualizador'];
      if (!cargosValidos.includes(role)) {
        res.status(400).json({ message: 'Cargo inválido. Escolha entre: admin, operador, visualizador.' });
        return;
      }

      // Buscar o solicitante
      const solicitante = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
      if (!solicitante || solicitante.role !== 'admin') {
        res.status(403).json({ message: 'Acesso negado: apenas administradores podem alterar cargos.' });
        return;
      }

      // Evitar lockout
      if (Number(id) === usuarioId) {
        res.status(400).json({ message: 'Acesso negado: você não pode alterar o seu próprio cargo.' });
        return;
      }

      // Buscar o usuário alvo
      const usuarioAlvo = await this.usuarioRepository.findOne({ where: { id: Number(id) } });
      if (!usuarioAlvo) {
        res.status(404).json({ message: 'Usuário não encontrado.' });
        return;
      }

      // Atualizar no banco
      usuarioAlvo.role = role;
      usuarioAlvo.isAdmin = (role === 'admin');

      await this.usuarioRepository.save(usuarioAlvo);

      res.status(200).json({
        message: `Cargo de ${usuarioAlvo.email} alterado para "${role}" com sucesso!`,
        usuario: {
          id: usuarioAlvo.id,
          email: usuarioAlvo.email,
          role: usuarioAlvo.role,
          isAdmin: usuarioAlvo.isAdmin
        }
      });
    } catch (error: any) {
      res.status(500).json({ message: 'Erro ao alterar cargo do usuário', error: error.message });
    }
  }
}
