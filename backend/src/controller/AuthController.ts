import { Request, Response } from 'express';
import { AuthService } from '../service/AuthService';

export class AuthController {
  constructor(private authService: AuthService) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, senha } = req.body;
      const resultado = await this.authService.register(email, senha);
      res.status(201).json({
        message: 'Usuário cadastrado com sucesso',
        usuario: {
          id: resultado.usuario.id,
          email: resultado.usuario.email,
        },
        token: resultado.token,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, senha } = req.body;
      const resultado = await this.authService.login(email, senha);
      res.status(200).json({
        message: 'Login realizado com sucesso',
        usuario: {
          id: resultado.usuario.id,
          email: resultado.usuario.email,
        },
        token: resultado.token,
      });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }
}
