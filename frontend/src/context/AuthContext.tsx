import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import api from '../services/api';

interface User {
  id: string;
  email: string;
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  login(email: string, senha: string): Promise<void>;
  logout(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carrega o usuário e token salvos ao inicializar o app
    const storagedToken = localStorage.getItem('@ProfitPulse:token');
    const storagedUser = localStorage.getItem('@ProfitPulse:user');

    if (storagedToken && storagedUser) {
      setUser(JSON.parse(storagedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, senha: string) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, senha });
      const { token, usuario } = response.data;

      localStorage.setItem('@ProfitPulse:token', token);
      localStorage.setItem('@ProfitPulse:user', JSON.stringify(usuario));

      setUser(usuario);
    } catch (error: any) {
      localStorage.removeItem('@ProfitPulse:token');
      localStorage.removeItem('@ProfitPulse:user');
      setUser(null);
      throw new Error(error.response?.data?.message || 'Erro ao realizar login.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('@ProfitPulse:token');
    localStorage.removeItem('@ProfitPulse:user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
