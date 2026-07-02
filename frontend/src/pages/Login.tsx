import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag } from 'lucide-react';
import api from '../services/api';
import './Login.css';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; senha?: string; confirmSenha?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errors: typeof fieldErrors = {};
    let isValid = true;

    if (!email.trim()) {
      errors.email = 'E-mail é obrigatório.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Insira um e-mail válido.';
      isValid = false;
    }

    if (!senha) {
      errors.senha = 'Senha é obrigatória.';
      isValid = false;
    } else if (senha.length < 6) {
      errors.senha = 'A senha deve conter no mínimo 6 caracteres.';
      isValid = false;
    }

    if (isRegisterMode && senha !== confirmSenha) {
      errors.confirmSenha = 'As senhas não coincidem.';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (isRegisterMode) {
        // Envia requisição de cadastro para o backend
        await api.post('/auth/register', { email, senha });
        // Efetua login automático após cadastro com sucesso
        await login(email, senha);
      } else {
        // Envia requisição de login
        await login(email, senha);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro no processo. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <ShoppingBag size={32} />
          </div>
          <h2 className="login-title">ProfitPulse</h2>
          <p className="login-subtitle">
            {isRegisterMode 
              ? 'Crie sua conta administrativa' 
              : 'Entre no painel de controle'
            }
          </p>
        </div>

        {error && <div className="login-alert">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="exemplo@zaffari.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
            {fieldErrors.email && <span className="form-error">{fieldErrors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              className="form-input"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              disabled={isSubmitting}
            />
            {fieldErrors.senha && <span className="form-error">{fieldErrors.senha}</span>}
          </div>

          {isRegisterMode && (
            <div className="form-group">
              <label className="form-label" htmlFor="confirmSenha">Confirmar Senha</label>
              <input
                type="password"
                id="confirmSenha"
                className="form-input"
                placeholder="••••••••"
                value={confirmSenha}
                onChange={(e) => setConfirmSenha(e.target.value)}
                disabled={isSubmitting}
              />
              {fieldErrors.confirmSenha && <span className="form-error">{fieldErrors.confirmSenha}</span>}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '8px' }}
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? 'Processando...' 
              : isRegisterMode ? 'Cadastrar' : 'Entrar no Sistema'
            }
          </button>
        </form>

        <div className="login-footer">
          <span>
            {isRegisterMode ? 'Já possui conta?' : 'Não possui conta admin?'}
          </span>{' '}
          <button 
            type="button" 
            className="login-footer-link"
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setError(null);
              setFieldErrors({});
            }}
            disabled={isSubmitting}
          >
            {isRegisterMode ? 'Fazer login' : 'Cadastre-se'}
          </button>
        </div>
      </div>
    </div>
  );
};
