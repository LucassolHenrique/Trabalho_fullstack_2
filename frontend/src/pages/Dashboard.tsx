import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  ShoppingBag, 
  Layers, 
  DollarSign, 
  AlertTriangle, 
  Percent, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import './Dashboard.css';

interface Categoria {
  id: string;
  nome: string;
  descricao?: string;
}

interface Produto {
  id: string;
  nome: string;
  preco: number;
  estoque: number;
  categoriaId: string;
  categoria?: Categoria;
}

export const Dashboard: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados do Reajuste em Lote (Lógica de Negócio)
  const [reajusteCatId, setReajusteCatId] = useState('');
  const [reajusteTipo, setReajusteTipo] = useState<'aumento' | 'desconto'>('aumento');
  const [reajustePorcento, setReajustePorcento] = useState<number | ''>('');
  
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [resProdutos, resCategorias] = await Promise.all([
        api.get('/produtos'),
        api.get('/categorias'),
      ]);
      setProdutos(resProdutos.data);
      setCategorias(resCategorias.data);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handlers
  const handleReajusteLote = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionSuccess(null);
    setActionError(null);

    if (!reajusteCatId) {
      setActionError('Por favor, selecione uma categoria.');
      return;
    }
    if (reajustePorcento === '' || reajustePorcento <= 0) {
      setActionError('A porcentagem de reajuste deve ser maior que zero.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post('/produtos/reajuste-lote', {
        categoriaId: reajusteCatId,
        tipo: reajusteTipo,
        porcentagem: Number(reajustePorcento)
      });
      setActionSuccess(response.data.message || 'Preços reajustados com sucesso!');
      setReajustePorcento('');
      // Recarrega os dados atualizados do banco
      await fetchDashboardData();
    } catch (error: any) {
      setActionError(error.response?.data?.message || 'Falha ao reajustar preços em lote.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cálculos Estatísticos
  const totalProdutos = produtos.length;
  const totalCategorias = categorias.length;
  
  const valorTotalEstoque = produtos.reduce((acc, curr) => acc + (Number(curr.preco) * curr.estoque), 0);
  const produtosAlertaEstoque = produtos.filter(p => p.estoque < 5);
  const produtosSemEstoque = produtos.filter(p => p.estoque === 0).length;

  // Distribuição de produtos por categoria
  const getCategoriaDistribution = (catId: string) => {
    if (totalProdutos === 0) return 0;
    const count = produtos.filter(p => p.categoriaId === catId).length;
    return {
      count,
      percentage: Math.round((count / totalProdutos) * 100)
    };
  };

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
        <h3>Carregando estatísticas do dashboard...</h3>
      </div>
    );
  }

  return (
    <div>
      {/* Bento Grid Stats */}
      <div className="dashboard-grid">
        {/* Card 1: Total Produtos */}
        <div className="card stat-card">
          <div className="stat-info">
            <span className="stat-label">Produtos Cadastrados</span>
            <span className="stat-value">{totalProdutos}</span>
          </div>
          <div className="stat-icon">
            <ShoppingBag size={24} />
          </div>
        </div>

        {/* Card 2: Total Categorias */}
        <div className="card stat-card">
          <div className="stat-info">
            <span className="stat-label">Categorias</span>
            <span className="stat-value">{totalCategorias}</span>
          </div>
          <div className="stat-icon">
            <Layers size={24} />
          </div>
        </div>

        {/* Card 3: Valor do Estoque */}
        <div className="card stat-card">
          <div className="stat-info">
            <span className="stat-label">Valor do Estoque</span>
            <span className="stat-value">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorTotalEstoque)}
            </span>
          </div>
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
        </div>

        {/* Card 4: Ruptura de Estoque */}
        <div className="card stat-card">
          <div className="stat-info">
            <span className="stat-label">Esgotados / Alerta</span>
            <span className="stat-value">
              {produtosSemEstoque} <span style={{ fontSize: '16px', color: 'var(--text-muted)' }}>/ {produtosAlertaEstoque.length}</span>
            </span>
          </div>
          <div className="stat-icon" style={{ color: produtosAlertaEstoque.length > 0 ? 'var(--warning)' : 'var(--success)' }}>
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      <div className="dashboard-panels">
        {/* Lógica de Negócio: Reajuste em Lote */}
        <div className="card action-panel">
          <div>
            <h3 className="panel-title">Ajuste de Preços em Lote</h3>
            <p className="panel-desc">
              Aplique uma alteração percentual de preço a todos os produtos de uma categoria selecionada de forma automática.
            </p>
          </div>

          {actionSuccess && (
            <div className="badge badge-success" style={{ padding: '10px 14px', width: '100%', textTransform: 'none', justifyContent: 'flex-start', gap: '8px', marginBottom: '10px' }}>
              <CheckCircle2 size={16} />
              <span>{actionSuccess}</span>
            </div>
          )}

          {actionError && (
            <div className="badge badge-danger" style={{ padding: '10px 14px', width: '100%', textTransform: 'none', justifyContent: 'flex-start', gap: '8px', marginBottom: '10px' }}>
              <AlertCircle size={16} />
              <span>{actionError}</span>
            </div>
          )}

          <form onSubmit={handleReajusteLote}>
            <div className="form-group">
              <label className="form-label">Categoria Alvo</label>
              <select 
                className="form-select"
                value={reajusteCatId}
                onChange={(e) => setReajusteCatId(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="">Selecione uma categoria...</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nome}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Operação</label>
                <select 
                  className="form-select"
                  value={reajusteTipo}
                  onChange={(e) => setReajusteTipo(e.target.value as any)}
                  disabled={isSubmitting}
                >
                  <option value="aumento">Aumentar Preço (+)</option>
                  <option value="desconto">Dar Desconto (-)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Porcentagem (%)</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0.01"
                    className="form-input" 
                    placeholder="10.00"
                    value={reajustePorcento}
                    onChange={(e) => setReajustePorcento(e.target.value !== '' ? Number(e.target.value) : '')}
                    disabled={isSubmitting}
                  />
                  <Percent size={16} style={{ position: 'absolute', right: '14px', top: '14px', color: 'var(--text-muted)' }} />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '8px' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processando reajuste...' : (
                reajusteTipo === 'aumento' ? (
                  <>
                    <TrendingUp size={16} /> Aplicar Reajuste
                  </>
                ) : (
                  <>
                    <TrendingDown size={16} /> Aplicar Desconto
                  </>
                )
              )}
            </button>
          </form>
        </div>

        {/* Alertas de Estoque Crítico (< 5 unidades) */}
        <div className="card">
          <h3 className="panel-title" style={{ color: produtosAlertaEstoque.length > 0 ? 'var(--warning)' : 'inherit' }}>
            Estoque Crítico Alertas
          </h3>
          <p className="panel-desc">Itens com nível de estoque abaixo de 5 unidades.</p>

          <div className="alert-list">
            {produtosAlertaEstoque.length === 0 ? (
              <div className="empty-alerts">
                <CheckCircle2 size={32} style={{ color: 'var(--success)' }} />
                <span>Nenhum alerta de estoque crítico no momento!</span>
              </div>
            ) : (
              produtosAlertaEstoque.map(prod => (
                <div className="alert-item" key={prod.id}>
                  <div>
                    <h5 className="alert-product-name">{prod.nome}</h5>
                    <span className="alert-category">
                      {categorias.find(c => c.id === prod.categoriaId)?.nome || 'Sem Categoria'}
                    </span>
                  </div>
                  <span className="alert-stock">
                    <AlertTriangle size={14} />
                    {prod.estoque === 0 ? 'Sem estoque' : `${prod.estoque} un.`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Seção Extra: Distribuição Visual das Categorias */}
      <div className="card" style={{ marginTop: '24px' }}>
        <h3 className="panel-title">Produtos por Categoria</h3>
        <p className="panel-desc">Distribuição percentual dos produtos cadastrados entre as categorias existentes.</p>
        
        <div className="analytics-list">
          {categorias.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Nenhuma categoria disponível.</p>
          ) : (
            categorias.map(cat => {
              const { count, percentage } = getCategoriaDistribution(cat.id) as { count: number; percentage: number };
              return (
                <div className="analytics-item" key={cat.id}>
                  <div className="analytics-header">
                    <span>{cat.nome}</span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {count} {count === 1 ? 'produto' : 'produtos'} ({percentage}%)
                    </span>
                  </div>
                  <div className="analytics-bar-bg">
                    <div className="analytics-bar-fill" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
