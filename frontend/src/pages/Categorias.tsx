import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit, Trash2, X, FolderKanban } from 'lucide-react';
import './Categorias.css';

interface Categoria {
  id: string;
  nome: string;
  descricao?: string;
}

export const Categorias: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);

  // Form Fields
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');

  // Form States
  const [formErrors, setFormErrors] = useState<{ nome?: string }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchCategorias = async () => {
    setLoading(true);
    try {
      const response = await api.get('/categorias');
      setCategorias(response.data);
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Erro ao carregar categorias.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const openCreateModal = () => {
    setEditingCategoria(null);
    setNome('');
    setDescricao('');
    setFormErrors({});
    setApiError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Categoria) => {
    setEditingCategoria(cat);
    setNome(cat.nome);
    setDescricao(cat.descricao || '');
    setFormErrors({});
    setApiError(null);
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors: typeof formErrors = {};
    let isValid = true;

    if (!nome.trim()) {
      errors.nome = 'Nome da categoria é obrigatório.';
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
      const payload = { nome, descricao };

      if (editingCategoria) {
        await api.put(`/categorias/${editingCategoria.id}`, payload);
      } else {
        await api.post('/categorias', payload);
      }
      setIsModalOpen(false);
      fetchCategorias();
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Falha ao salvar categoria.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Atenção: Deletar a categoria "${name}" pode afetar produtos vinculados a ela. Deseja continuar?`)) {
      try {
        await api.delete(`/categorias/${id}`);
        fetchCategorias();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Erro ao deletar categoria.');
      }
    }
  };

  if (loading && categorias.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
        <h3>Carregando categorias...</h3>
      </div>
    );
  }

  return (
    <div>
      <div className="category-page-header">
        <div>
          <h2 className="category-title-sec">Gerenciamento de Categorias</h2>
          <p className="category-description-text">Organize seus produtos em divisões lógicas.</p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={18} /> Nova Categoria
        </button>
      </div>

      {apiError && <div className="login-alert" style={{ marginBottom: '24px' }}>{apiError}</div>}

      {/* Grid of Categories Cards */}
      <div className="category-grid">
        {categorias.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
            Nenhuma categoria encontrada. Clique em "Nova Categoria" para cadastrar.
          </div>
        ) : (
          categorias.map(cat => (
            <div className="card category-card" key={cat.id}>
              <div>
                <div className="category-card-header">
                  <h4 className="category-card-title">{cat.nome}</h4>
                  <span style={{ color: 'var(--primary)' }}>
                    <FolderKanban size={18} />
                  </span>
                </div>
                <p className="category-card-body">
                  {cat.descricao || 'Sem descrição cadastrada para esta categoria.'}
                </p>
              </div>

              <div className="category-card-actions">
                <button 
                  onClick={() => openEditModal(cat)} 
                  className="btn btn-secondary btn-sm"
                >
                  <Edit size={14} /> Editar
                </button>
                <button 
                  onClick={() => handleDelete(cat.id, cat.nome)} 
                  className="btn btn-danger btn-sm"
                >
                  <Trash2 size={14} /> Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Modal Dialog */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {editingCategoria ? 'Editar Categoria' : 'Nova Categoria'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="modal-close-btn">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="nome">Nome da Categoria</label>
                <input 
                  type="text" 
                  id="nome" 
                  className="form-input"
                  placeholder="Ex: Eletrônicos, Livros, Vestuário"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  disabled={submitting}
                />
                {formErrors.nome && <span className="form-error">{formErrors.nome}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="descricao">Descrição (Opcional)</label>
                <textarea 
                  id="descricao" 
                  className="form-input"
                  style={{ minHeight: '100px', resize: 'vertical' }}
                  placeholder="Ex: Celulares, notebooks, acessórios eletrônicos em geral..."
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
                  {submitting ? 'Salvando...' : 'Salvar Categoria'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
