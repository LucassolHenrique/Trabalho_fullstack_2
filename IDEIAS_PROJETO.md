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

## 💡 Ideia 2: Vitrine Virtual e Catálogo Interativo (Client Storefront)
*Focado na experiência do cliente final navegando no catálogo e simulando compras.*

### 🛠️ Telas e Componentes
1.  **Catálogo de Produtos (Home Pública):**
    *   Grid responsivo de cards de produtos muito elegante, contendo imagens ilustrativas (ou placeholders premium de cores sólidas com gradientes), nome, preço formatado, e indicador de disponibilidade em estoque.
    *   Menu lateral colapsável com filtro por Categorias, controle de preço mínimo/máximo (slider) e ordenação por preço.
2.  **Detalhes do Produto (Rota Dinâmica `/produto/:id`):**
    *   Exibição detalhada do produto com descrição completa, categoria correspondente, preço em destaque e quantidade desejada para simulação de compra.
3.  **Carrinho de Compras Flutuante (Estado Global/Local):**
    *   Gaveta lateral (Drawer) que exibe os produtos adicionados, cálculo dinâmico de subtotal, frete fictício e botão de checkout.
4.  **Portal do Cliente (Login/Cadastro):**
    *   O usuário precisa se autenticar para efetivar a compra.

### ⚙️ Funcionalidades de Negócio (Requisito Conceito A)
*   **Simulador de Compra (Checkout):** Ao clicar em "Finalizar Compra", a SPA envia requisições `PUT` para a API diminuindo o estoque dos produtos adquiridos. Caso um produto não possua estoque suficiente no banco, o front-end avisa o cliente amigavelmente e bloqueia a ação.
*   **Histórico Fictício de Pedidos:** Tela onde o cliente visualiza as compras simuladas que foram gravadas em estado local (`localStorage`) associadas ao seu usuário.

---

## 💡 Ideia 3: Sistema de Inventário e Auditoria de Estoque
*Focado no controle rígido de perdas, entradas e rastreamento de mercadorias.*

### 🛠️ Telas e Componentes
1.  **Painel de Auditoria Geral (Home Privada):**
    *   Indicadores de valor monetário total em estoque (Soma de `preço * estoque` de todos os produtos).
    *   Alerta de ruptura de estoque (produtos com estoque zerado) destacados em vermelho vibrante.
    *   Filtro de busca avançada multi-campos.
2.  **Formulário de Entrada/Saída de Mercadoria:**
    *   Formulário robusto com validações completas (quantidade não pode ser negativa, preço de custo coerente).
    *   Combobox (Select) dinâmico que busca as Categorias existentes na API.
3.  **Relatório de Categorias:**
    *   Exibição das categorias em estilo "Cards de Pasta" com o total de itens vinculados a elas e descrição detalhada.

### ⚙️ Funcionalidades de Negócio (Requisito Conceito A)
*   **Auditoria Rápida (Estoque Crítico):** Aba de "Ações Urgentes" que lista apenas produtos abaixo de um limite de estoque (ex: menor que 5 unidades). O usuário pode repor o estoque diretamente com um clique por meio de um formulário simplificado em linha na própria tabela.
*   **Relatório de Exportação (Simulado):** Botão que gera um arquivo formatado (ex: CSV fictício gerado no próprio navegador ou impressão formatada da tela em PDF) contendo a lista consolidada de produtos e valores do inventário.

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
