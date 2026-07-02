import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'seu_secret_super_seguro_aqui_123456';

export interface AuthRequest extends Request {
  usuarioId?: number;
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Token não fornecido' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    req.usuarioId = decoded.id;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Token inválido ou expirado' });
  }
}
