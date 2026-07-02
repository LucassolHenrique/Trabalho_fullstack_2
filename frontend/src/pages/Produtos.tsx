import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  ChevronUp, 
  ChevronDown, 
  ShoppingBag, 
  AlertTriangle,
  RotateCw
} from 'lucide-react';
import './Produtos.css';

interface Categoria {
  id: string;
  nome: string;
}

interface Produto {
  id: string;
  nome: string;
  preco: number;
  descricao?: string;
  estoque: number;
  categoriaId: string;
  categoria?: Categoria;
  dataCriacao?: string;
}

export const Produtos: React.FC = () => {
  const { user } = useAuth();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');

  // Modais de Criação / Edição
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduto, setEditingProduto] = useState<Produto | null>(null);

  // Form Fields
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState<number | ''>('');
  const [estoque, setEstoque] = useState<number | ''>('');
  const [descricao, setDescricao] = useState('');
  const [categoriaId, setCategoriaId] = useState('');

  // Erros e submissão
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resProd, resCat] = await Promise.all([
        api.get('/produtos'),
        api.get('/categorias'),
      ]);
      setProdutos(resProd.data);
      setCategorias(resCat.data);
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Erro ao carregar dados do servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingProduto(null);
    setNome('');
    setPreco('');
    setEstoque(0);
    setDescricao('');
    setCategoriaId(categorias[0]?.id || '');
    setFormErrors({});
    setApiError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (produto: Produto) => {
    setEditingProduto(produto);
    setNome(produto.nome);
    setPreco(produto.preco);
    setEstoque(produto.estoque);
    setDescricao(produto.descricao || '');
    setCategoriaId(produto.categoriaId);
    setFormErrors({});
    setApiError(null);
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors: typeof formErrors = {};
    let isValid = true;

    if (!nome.trim()) {
      errors.nome = 'Nome do produto é obrigatório.';
      isValid = false;
    }
    if (preco === '' || preco <= 0) {
      errors.preco = 'Preço deve ser maior que zero.';
      isValid = false;
    }
    if (estoque === '' || estoque < 0) {
      errors.estoque = 'Estoque não pode ser negativo.';
      isValid = false;
    }
    if (!categoriaId) {
      errors.categoriaId = 'Selecione uma categoria.';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const payload = {
        nome,
        preco: Number(preco),
        estoque: Number(estoque),
        descricao,
        categoriaId,
      };

      if (editingProduto) {
        // Atualizar produto existente (PUT)
        await api.put(`/produtos/${editingProduto.id}`, payload);
      } else {
        // Criar novo produto (POST)
        await api.post('/produtos', payload);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Erro ao salvar o produto.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Tem certeza de que deseja deletar o produto "${name}"?`)) {
      try {
        await api.delete(`/produtos/${id}`);
        loadData();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Falha ao deletar produto.');
      }
    }
  };

  // Ajuste rápido de estoque (+1 / -1) - Regra de Negócio Concept A
  const handleQuickStock = async (id: string, change: number) => {
    try {
      const response = await api.patch(`/produtos/${id}/estoque`, { quantidade: change });
      
      // Atualiza o estado local imediatamente
      setProdutos(prev => prev.map(prod => {
        if (prod.id === id) {
          return { ...prod, estoque: response.data.estoque };
        }
        return prod;
      }));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Falha ao ajustar estoque de forma rápida.');
    }
  };

  // Filtragem local dos produtos
  const filteredProdutos = produtos.filter(prod => {
    const matchesSearch = prod.nome.toLowerCase().includes(search.toLowerCase()) || 
      (prod.descricao && prod.descricao.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = selectedCat ? prod.categoriaId === selectedCat : true;
    return matchesSearch && matchesCat;
  });

  const getStockBadge = (stock: number) => {
    if (stock === 0) return <span className="badge badge-danger">Sem estoque</span>;
    if (stock < 5) return <span className="badge badge-warning">Crítico ({stock})</span>;
    return <span className="badge badge-success">OK ({stock})</span>;
  };

  if (loading && produtos.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
        <h3>Carregando produtos...</h3>
      </div>
    );
  }

  return (
    <div>
      {/* Top Controls Header */}
      <div className="controls-header">
        <div className="search-filter-box">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Buscar produtos por nome ou descrição..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="form-select category-select-filter"
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
          >
            <option value="">Todas as categorias</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nome}</option>
            ))}
          </select>
        </div>

        {user?.role !== 'visualizador' && (
          <button onClick={openCreateModal} className="btn btn-primary">
            <Plus size={18} /> Novo Produto
          </button>
        )}
      </div>

      {/* Products Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Preço</th>
              <th>Status do Estoque</th>
              <th style={{ width: '180px' }}>Controle Rápido</th>
              {user?.role !== 'visualizador' && <th style={{ width: '120px', textAlign: 'right' }}>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {filteredProdutos.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-table-state">
                  Nenhum produto cadastrado ou correspondente aos filtros.
                </td>
              </tr>
            ) : (
              filteredProdutos.map(prod => (
                <tr key={prod.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{prod.nome}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {prod.descricao || 'Sem descrição'}
                    </div>
                  </td>
                  <td>
                    {categorias.find(c => c.id === prod.categoriaId)?.nome || 'Carregando...'}
                  </td>
                  <td style={{ fontWeight: 550 }}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(prod.preco)}
                  </td>
                  <td>{getStockBadge(prod.estoque)}</td>
                  <td>
                    {/* Quick Stock adjustment controls (Concept A Business Rule) */}
                    <div className="stock-adjust-cell">
                      {user?.role !== 'visualizador' && (
                        <div className="quick-stock-controls">
                          <button 
                            className="quick-stock-btn minus"
                            onClick={() => handleQuickStock(prod.id, -1)}
                            disabled={prod.estoque <= 0}
                            title="Diminuir 1 un."
                          >
                            <ChevronDown size={16} />
                          </button>
                          <button 
                            className="quick-stock-btn"
                            onClick={() => handleQuickStock(prod.id, 1)}
                            title="Aumentar 1 un."
                          >
                            <ChevronUp size={16} />
                          </button>
                        </div>
                      )}
                      <span className="stock-badge-display" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        Estoque: <strong>{prod.estoque}</strong>
                      </span>
                    </div>
                  </td>
                  {user?.role !== 'visualizador' && (
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => openEditModal(prod)} 
                          className="btn btn-secondary btn-sm btn-icon"
                          title="Editar produto"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(prod.id, prod.nome)} 
                          className="btn btn-danger btn-sm btn-icon"
                          title="Deletar produto"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal Dialog */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {editingProduto ? 'Editar Produto' : 'Cadastrar Novo Produto'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="modal-close-btn">
                <X size={18} />
              </button>
            </div>

            {apiError && (
              <div className="login-alert" style={{ marginBottom: '16px' }}>
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="nome">Nome do Produto</label>
                <input 
                  type="text" 
                  id="nome" 
                  className="form-input"
                  placeholder="Ex: Notebook Dell Inspiron"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  disabled={submitting}
                />
                {formErrors.nome && <span className="form-error">{formErrors.nome}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="preco">Preço (R$)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    id="preco" 
                    className="form-input"
                    placeholder="3500.00"
                    value={preco}
                    onChange={(e) => setPreco(e.target.value !== '' ? Number(e.target.value) : '')}
                    disabled={submitting}
                  />
                  {formErrors.preco && <span className="form-error">{formErrors.preco}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="estoque">Estoque Inicial</label>
                  <input 
                    type="number" 
                    id="estoque" 
                    className="form-input"
                    placeholder="10"
                    value={estoque}
                    onChange={(e) => setEstoque(e.target.value !== '' ? Number(e.target.value) : '')}
                    disabled={submitting || !!editingProduto} // Desativa edição do estoque no CRUD padrão, forçando o uso do ajuste rápido (A) ou mantendo-o coerente
                  />
                  {formErrors.estoque && <span className="form-error">{formErrors.estoque}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="categoriaId">Categoria</label>
                <select 
                  id="categoriaId" 
                  className="form-select"
                  value={categoriaId}
                  onChange={(e) => setCategoriaId(e.target.value)}
                  disabled={submitting}
                >
                  <option value="">Selecione uma categoria...</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nome}</option>
                  ))}
                </select>
                {formErrors.categoriaId && <span className="form-error">{formErrors.categoriaId}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="descricao">Descrição (Opcional)</label>
                <textarea 
                  id="descricao" 
                  className="form-input"
                  style={{ minHeight: '80px', resize: 'vertical' }}
                  placeholder="Ficha técnica simplificada ou especificações..."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  disabled={submitting}
                />
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="btn btn-secondary"
                  disabled={submitting}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Salvando...' : 'Salvar Produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
