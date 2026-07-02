import { Response, NextFunction } from 'express';
import { AuthRequest } from './authenticateToken';
import { Usuario } from '../model/Usuario';
import { DataSource } from 'typeorm';

export function authorizeRole(allowedRoles: string[], dataSource: DataSource) {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const usuarioId = req.usuarioId;

      if (!usuarioId) {
        res.status(401).json({ message: 'Não autenticado' });
        return;
      }

      // Buscar o usuário e seu cargo direto do banco de dados
      const usuarioRepository = dataSource.getRepository(Usuario);
      const usuario = await usuarioRepository.findOne({ where: { id: usuarioId } });

      if (!usuario) {
        res.status(401).json({ message: 'Usuário não encontrado' });
        return;
      }

      // Verificar se o cargo do usuário está no array de permissões da rota
      if (!allowedRoles.includes(usuario.role)) {
        res.status(403).json({ message: 'Acesso negado: permissão insuficiente para realizar esta operação.' });
        return;
      }

      next();
    } catch (error: any) {
      res.status(500).json({ message: 'Erro ao verificar permissões de acesso.', error: error.message });
    }
  };
}
