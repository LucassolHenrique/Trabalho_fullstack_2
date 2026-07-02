import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  Users, 
  ShieldAlert, 
  UserCheck, 
  Calendar, 
  Shield, 
  Mail,
  AlertCircle,
  CheckCircle2,
  Eye
} from 'lucide-react';
import './Usuarios.css';

interface Usuario {
  id: number;
  email: string;
  isAdmin: boolean;
  role: string;
  dataCriacao: string;
}

export const Usuarios: React.FC = () => {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Apenas carrega se for admin
    if (user?.role === 'admin') {
      carregarUsuarios();
    }
  }, [user]);

  const carregarUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/usuarios');
      setUsuarios(response.data);
    } catch (err: any) {
      console.error('Erro ao carregar usuários:', err);
      setError(err.response?.data?.message || 'Falha ao carregar lista de usuários.');
    } finally {
      setLoading(false);
    }
  };

  const handleAlterarCargo = async (id: number, role: string) => {
    try {
      setError(null);
      setActionSuccess(null);
      const response = await api.patch(`/usuarios/${id}/role`, { role });
      
      // Atualizar localmente
      setUsuarios(prev => prev.map(u => {
        if (u.id === id) {
          return { ...u, role, isAdmin: role === 'admin' };
        }
        return u;
      }));

      setActionSuccess(response.data.message || 'Cargo atualizado com sucesso!');
      
      // Limpa aviso de sucesso após 3 segundos
      setTimeout(() => {
        setActionSuccess(null);
      }, 4000);
    } catch (err: any) {
      console.error('Erro ao alterar cargo:', err);
      setError(err.response?.data?.message || 'Erro ao alterar o cargo do usuário.');
    }
  };

  // Se o usuário não for administrador, redireciona imediatamente para o Dashboard
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Estatísticas Dinâmicas baseadas no role
  const totalUsuarios = usuarios.length;
  const totalAdmins = usuarios.filter(u => u.role === 'admin').length;
  const totalOperadores = usuarios.filter(u => u.role === 'operador').length;
  const totalVisualizadores = usuarios.filter(u => u.role === 'visualizador').length;

  const formatarData = (dataStr: string) => {
    try {
      const data = new Date(dataStr);
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(data);
    } catch (e) {
      return dataStr;
    }
  };

  return (
    <div className="usuarios-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Gerenciamento de Usuários</h2>
          <p className="page-desc">Painel exclusivo para administradores controlarem os níveis de acesso e cargos dos usuários.</p>
        </div>
      </div>

      {error && (
        <div className="badge badge-danger error-alert" style={{ marginBottom: '16px' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {actionSuccess && (
        <div className="badge badge-success success-alert" style={{ marginBottom: '16px', display: 'flex', width: '100%', textTransform: 'none', justifyContent: 'flex-start', gap: '8px', padding: '12px 16px' }}>
          <CheckCircle2 size={18} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Bento Grid Stats - 4 Cards */}
      <div className="usuarios-grid">
        {/* Card 1: Total */}
        <div className="card stat-card">
          <div className="stat-info">
            <span className="stat-label">Total de Usuários</span>
            <span className="stat-value">{loading ? '...' : totalUsuarios}</span>
          </div>
          <div className="stat-icon icon-users">
            <Users size={24} />
          </div>
        </div>

        {/* Card 2: Admins */}
        <div className="card stat-card">
          <div className="stat-info">
            <span className="stat-label">Administradores</span>
            <span className="stat-value">{loading ? '...' : totalAdmins}</span>
          </div>
          <div className="stat-icon icon-admin">
            <ShieldAlert size={24} />
          </div>
        </div>

        {/* Card 3: Operadores */}
        <div className="card stat-card">
          <div className="stat-info">
            <span className="stat-label">Operadores</span>
            <span className="stat-value">{loading ? '...' : totalOperadores}</span>
          </div>
          <div className="stat-icon icon-operator">
            <UserCheck size={24} />
          </div>
        </div>

        {/* Card 4: Visualizadores */}
        <div className="card stat-card">
          <div className="stat-info">
            <span className="stat-label">Visualizadores</span>
            <span className="stat-value">{loading ? '...' : totalVisualizadores}</span>
          </div>
          <div className="stat-icon icon-viewer" style={{ color: 'var(--text-muted)', backgroundColor: 'rgba(143, 160, 221, 0.1)' }}>
            <Eye size={24} />
          </div>
        </div>
      </div>

      {/* Tabela de Usuários */}
      <div className="card table-card" style={{ marginTop: '24px' }}>
        <h3 className="panel-title" style={{ marginBottom: '16px' }}>Lista de Contas</h3>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <h3>Carregando dados dos usuários...</h3>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>E-mail</th>
                  <th>Nível de Acesso (Cargo)</th>
                  <th>Data de Criação</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>#{u.id}</td>
                    <td>
                      <div className="user-email-cell">
                        <Mail size={16} style={{ color: 'var(--text-muted)' }} />
                        <span>{u.email}</span>
                      </div>
                    </td>
                    <td>
                      {/* Se for o próprio administrador logado, desabilita a edição */}
                      {u.id === Number(user?.id) ? (
                        <span className="badge badge-danger user-role-badge">
                          <Shield size={12} style={{ marginRight: '4px' }} />
                          Administrador (Você)
                        </span>
                      ) : (
                        <select
                          className="form-select role-select-in-table"
                          value={u.role}
                          onChange={(e) => handleAlterarCargo(u.id, e.target.value)}
                          style={{
                            padding: '6px 12px',
                            fontSize: '13px',
                            width: '180px',
                            backgroundColor: 'var(--surface-lowest)',
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-main)',
                            borderRadius: 'var(--border-radius)',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="admin">Administrador</option>
                          <option value="operador">Operador</option>
                          <option value="visualizador">Visualizador</option>
                        </select>
                      )}
                    </td>
                    <td>
                      <div className="user-date-cell">
                        <Calendar size={16} style={{ color: 'var(--text-muted)', marginRight: '6px' }} />
                        <span>{formatarData(u.dataCriacao)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
