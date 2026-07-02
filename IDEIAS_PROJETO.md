# Ideias de Projetos Front-end para Integração

Abaixo estão detalhadas três ideias completas de aplicação front-end utilizando React, integradas com a API de **Produtos, Categorias e Usuários** do Trabalho 1. Todas as ideias são focadas em alcançar o **Conceito A**, com designs premium, interações dinâmicas e funcionalidades de negócio integradas.

---

## 🎨 Diretrizes Gerais de Design & UX (Premium)

Para garantir uma interface que impressione visualmente e proporcione uma excelente experiência de uso:
1.  **Paleta de Cores Moderna:** Fuja de cores puras ou padrões de navegador. Utilize temas com tons escuros elegantes (Sleek Dark Mode) com detalhes em gradientes (ex: *Indigo* para *Purple* ou *Emerald* para *Teal*).
2.  **Glassmorphism:** Use fundo levemente transparente com desfoque (`backdrop-filter: blur(10px)`) nos cards e modais para dar um aspecto premium.
3.  **Micro-interações:** Adicione transições suaves (`transition: all 0.3s ease`) em todos os botões, cards e links ao passar o mouse.
4.  **Tipografia Curada:** Importe fontes modernas do Google Fonts no seu arquivo CSS principal (ex: `Outfit`, `Inter` ou `Plus Jakarta Sans`).

---

## 💡 Ideia 1: Painel Administrativo de E-commerce (Admin Dashboard)
*Focado na gestão interna de estoque, catálogo e análise de vendas.*

### 🛠️ Telas e Componentes
1.  **Tela de Login (Autenticação):**
    *   Formulário moderno e centralizado na tela com efeitos de vidro (*glassmorphism*).
    *   Feedback em tempo real de campos obrigatórios (email válido e senha com requisitos de tamanho).
    *   Armazenamento do Token JWT no `localStorage`.
2.  **Dashboard Principal (Página Inicial - Privada):**
    *   Cards de resumo: Total de produtos em catálogo, total de categorias, alerta de produtos sem estoque.
    *   Gráfico simples (pode ser montado com CSS puro usando barras de porcentagem ou a biblioteca `Recharts`) que exibe a quantidade de produtos por categoria.
    *   Lista de atividades recentes.
3.  **Controle de Catálogo (Listagem & CRUD):**
    *   Tabela interativa e responsiva listando os produtos com imagem (ou um ícone placeholder gerado por categoria), nome, preço, estoque e categoria correspondente.
    *   Filtros rápidos no topo da tabela por Categoria e busca textual por nome do produto.
    *   Botão para abrir modal ou navegar para o formulário de cadastro/edição de produtos.
4.  **Gerenciamento de Categorias (Tabela Secundária):**
    *   Interface lateral ou aba separada para gerenciar as Categorias (CRUD completo de Categoria).

### ⚙️ Funcionalidades de Negócio (Requisito Conceito A)
*   **Ajuste em Lote (Markup de Preço):** Uma ferramenta no dashboard onde o administrador pode selecionar uma categoria e aplicar um desconto ou reajuste de preço em lote (ex: +10% ou -15% em todos os produtos da categoria "Eletrônicos").
*   **Alerta e Reposição Rápida:** Botão de ação rápida na listagem que permite adicionar `+10` unidades ao estoque de um produto de forma instantânea através de uma chamada rápida `PUT /api/produtos/:id`.

---

## 🧬 Estrutura de Pastas Recomendada (Front-end)

Para manter o projeto limpo, escalável e bem avaliado em componentização:

```text
frontend/
├── src/
│   ├── assets/             # Imagens, logotipos e fontes
│   ├── components/         # Componentes compartilhados e reutilizáveis
│   │   ├── Button/         # Botões customizados
│   │   ├── Card/           # Cards de produtos
│   │   ├── FormInput/      # Campos de formulário com validação
│   │   ├── Navbar/         # Barra de navegação principal
│   │   └── Sidebar/        # Menu lateral de filtros/navegação
│   ├── context/            # Contextos globais (AuthContext para login)
│   ├── hooks/              # Custom hooks (ex: useFetch, useAuth)
│   ├── pages/              # Páginas completas (rotas)
│   │   ├── Login/          # Tela de login
│   │   ├── Dashboard/      # Tela inicial (Admin)
│   │   ├── Produtos/       # Listagem e CRUD de Produtos
│   │   └── Categorias/     # Listagem e CRUD de Categorias
│   ├── services/           # Comunicação com a API (Axios client)
│   │   └── api.ts          # Configuração básica do Axios
│   ├── App.tsx             # Gerenciamento de Rotas (React Router)
│   ├── index.css           # Estilização global e variáveis CSS
│   └── main.tsx            # Ponto de entrada do React
```

---

## 🔌 Exemplo Prático: Configuração do Cliente API (Axios)
Crie um arquivo em `src/services/api.ts` para centralizar as requisições e anexar automaticamente o token de autenticação:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Porta da sua API Express
});

// Interceptor para injetar o token JWT em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@App:token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
```
