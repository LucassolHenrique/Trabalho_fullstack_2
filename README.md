# 📊 ProfitPulse - Sistema de Controle de Inventário & Precificação

Este projeto é uma aplicação web Fullstack (SPA + API RESTful) voltada para a administração de catálogo de produtos, categorias e usuários, desenvolvida para o **Trabalho 2** da disciplina de Desenvolvimento Fullstack.

---

## 🛠️ Tecnologias Utilizadas

### Back-end
*   **Node.js** com **Express** (TypeScript)
*   **TypeORM** com banco de dados **SQLite** (gerando arquivo local `database.sqlite`)
*   **JWT (Json Web Token)** para autenticação e controle de sessões
*   **Bcrypt.js** para criptografia de senhas
*   **Swagger (swagger-ui-express & swagger-jsdoc)** para documentação interativa da API
*   **Node:test** para testes unitários automatizados

### Front-end
*   **React** (Vite + TypeScript)
*   **React Router Dom** para gerenciamento de rotas e navegação da SPA
*   **Axios** para consumo de serviços HTTP (com interceptores de requisição/resposta)
*   **Lucide React** para ícones modernos
*   **CSS Customizado** com design moderno (estilo *Glassmorphism* e *Sleek Dark Mode*)

---

## 📦 Como Executar o Projeto

### 1. Executando o Back-end
Abra um terminal no diretório `backend`:
```bash
# Instalar as dependências
npm install

# (Opcional) Executar o seed para popular o banco de dados com dados iniciais
npm run seed

# Executar a aplicação em modo de desenvolvimento (rodando em http://localhost:3000)
npm run dev

# Para rodar os testes unitários
npm test
```

### 2. Executando o Front-end
Abra outro terminal no diretório `frontend`:
```bash
# Instalar as dependências
npm install

# Executar o servidor de desenvolvimento (geralmente rodando em http://localhost:5173)
npm run dev
```

---

## 📈 Relação de Requisitos Atendidos (Grade de Avaliação)

### 🟢 Conceito C (Requisitos Básicos)
*   [x] **Apresentação clara** da arquitetura e organização do projeto.
*   [x] **Busca de dados (GET)** de produtos e categorias exibidos em tabelas e cards.
*   [x] **Cadastro de dados (POST)** a partir de formulários integrados com a API.
*   [x] **Componentização adequada** utilizando React.
*   [x] **Interface Web funcional** e de fácil uso.
*   [x] **Rotas (React-Router)** para navegar entre as telas.
*   [x] **Controle de Versão** estruturado com Git.

### 🟡 Conceito B (Aprofundamento)
*   [x] Todos os itens do Conceito C.
*   [x] **Gerenciamento de Estado** apropriado com hooks (`useState`, `useEffect`) e Context API.
*   [x] **CRUD completo** de Produtos e Categorias (Listagem, Cadastro, Atualização e Exclusão).
*   [x] **Validações** em formulários locais impedindo campos vazios ou inconsistentes.
*   [x] **Interface personalizada** com CSS customizado moderno.

### 🔵 Conceito A (Excelência / Regras de Negócio)
*   [x] **MVP funcional e caprichado** com tratamento amigável de erros da API.
*   [x] **Autenticação com Token JWT** persistido no localStorage e renovação inteligente.
*   [x] **Controle de Permissões (RBAC):** Usuários com role `visualizador` têm botões de criação, edição e exclusão desabilitados ou ocultados.
*   [x] **Funcionalidade de Negócio em Lote:** Reajuste percentual de preços de todos os produtos de uma categoria de uma só vez (`POST /produtos/reajuste-lote`).
*   [x] **Ajuste Rápido de Estoque:** Controle rápido de estoque diretamente na tabela de listagem de produtos (`PATCH /produtos/:id/estoque`).
*   [x] **Testes Unitários Automatizados:** Testes criados no backend para validação das regras de estoque e reajustes.
*   [x] **Swagger UI:** Documentação ativa em `http://localhost:3000/api-docs` com exemplos de payloads e autenticação de token.

---

## 🖥️ Roteiro de Apresentação (O que apresentar para o Professor)

Demonstre o projeto para o professor seguindo esta sequência lógica para validar todas as funcionalidades:

1.  **Tela de Login e Token JWT (Conceito A):**
    *   Mostre a tela de login inicial `/login`. Tente logar com campo vazio para mostrar a validação.
    *   Faça login com a conta de Administrador/Operador (`admin@example.com` / `senha123`).
2.  **Dashboard de Controle (Conceito B e A):**
    *   Exiba os totalizadores dinâmicos e o gráfico de distribuição de categorias.
    *   Destaque a seção de **Estoque Crítico** mostrando produtos abaixo de 5 unidades.
3.  **Controle de Permissões RBAC (Conceito A):**
    *   Deslogue do sistema e acesse com a conta de Visualizador (`visualizador@example.com` / `senha123`).
    *   Mostre que todos os botões de ação e cadastros (Produtos/Categorias) sumiram ou foram bloqueados para este usuário.
4.  **CRUDs e Validações (Conceito C e B):**
    *   Logue de volta como Admin. Vá para a página de **Categorias** e faça o ciclo completo: Crie, Edite e Exclua uma categoria.
    *   Vá para a página de **Produtos** e mostre os filtros rápidos de busca textual e filtro por categoria funcionando em tempo real.
    *   Tente cadastrar um produto com preço negativo para demonstrar a validação de formulário. Conclua o CRUD do produto.
5.  **Regras de Negócio Integradas (Conceito A):**
    *   **Incremento rápido:** Clique nos botões de `+` e `-` na tabela de produtos e mostre o estoque alterando na hora (via chamada `PATCH`).
    *   **Ajuste em lote:** No dashboard, selecione uma categoria, escolha a opção "Dar Desconto", informe a porcentagem e clique em aplicar. Mostre que os produtos daquela categoria tiveram o preço reajustados de forma conjunta.
6.  **Testes e Swagger UI (Conceito A):**
    *   Apresente o Swagger UI em `http://localhost:3000/api-docs` mostrando a documentação organizada de Usuários, Produtos, Categorias, com exemplos de payloads e autorização JWT configurada.
    *   Mostre os testes unitários passando executando `npm test` no console do backend.
