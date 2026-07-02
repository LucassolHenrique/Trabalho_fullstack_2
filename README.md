# Trabalho Full Stack 2: Desenvolvimento de SPA e Integração com API RESTful

Este repositório contém o desenvolvimento do **Trabalho 2** da disciplina de Programação Full Stack. O objetivo principal é desenvolver uma **Single Page Application (SPA)** em React no front-end e integrá-la com a **API RESTful** desenvolvida no Trabalho 1 (sistema de Gerenciamento de Produtos, Categorias e Usuários).

---

## 📅 Datas Importantes e Critérios de Entrega

*   **Data de Entrega e Apresentação:** 09/07/2026 (Em aula)
*   **Data Limite de Recuperação:** 16/07/2026 (Até 20h30)
    *   *Atenção:* Entregas na recuperação possuem penalidades (não é possível obter Conceito A; o trabalho deve ser obrigatoriamente individual; e há deslocamento dos requisitos dos conceitos B e C).
*   **Formato de Entrega:** Arquivo zipado contendo o front-end e back-end (sem `node_modules`) enviado via Blackboard, com o link do repositório GitHub nos comentários.

---

## 🎯 Critérios de Avaliação e Funcionalidades

Para obter cada conceito, os seguintes requisitos técnicos e de negócio devem ser atendidos:

### 🥉 Conceito C
- [ ] **Apresentação Clara:** Explicar o funcionamento e a arquitetura para o professor.
- [ ] **Consumo de API (GET):** Listar dados de uma entidade (ex: Produtos ou Categorias) em uma tabela ou em múltiplos cards.
- [ ] **Cadastro de Dados (POST):** Formulário funcional para criar novos registros no banco de dados através da API.
- [ ] **Componentização Adequada:** Divisão clara e reutilização de componentes React.
- [ ] **Interface Web Funcional:** Layout usável e funcional.
- [ ] **Navegação (React Router):** Uso de rotas para navegar entre as telas.
- [ ] **Controle de Versão:** Uso correto de Git e histórico de commits.

### 🥈 Conceito B
- [ ] **Todos os requisitos do Conceito C.**
- [ ] **Gerenciamento de Estado Apropriado:** Uso correto de Hooks React (`useState`, `useEffect`, etc.).
- [ ] **Navegação por Rotas Avançada:** Rotas separadas para listagem, visualização de detalhes e cadastro.
- [ ] **CRUD Completo ou Manipulação de Duas Entidades:** Implementar operações completas (GET, POST, PUT, DELETE) para as tabelas relacionadas (ex: Produto e Categoria).
- [ ] **Validações de Formulário:** Tratamento de campos obrigatórios e feedbacks de erro ao usuário.
- [ ] **Estilização CSS Adequada:** Interface bem polida com CSS (Vanilla CSS, CSS Modules, Bootstrap, Tailwind, etc.).

### 🥇 Conceito A (Recomendado para o MVP)
- [ ] **Todos os requisitos do Conceito B.**
- [ ] **MVP Funcional e Caprichado:** Excelente apresentação visual, tratamentos robustos de erro e validações rigorosas.
- [ ] **Funcionalidade de Negócio Avançada:** Operação complexa na API (ex: atualizar estoque ao simular venda, filtrar produtos dinamicamente por faixa de preço/categoria, ou dashboard analítico).
- [ ] **Autenticação com JWT:** Tela de login no front-end, armazenamento seguro do token (localStorage/sessionStorage), envio do token nas requisições HTTP (`Authorization: Bearer <token>`) e proteção de rotas privadas.
- [ ] **Interface Responsiva:** Interface adaptável para celulares, tablets e desktops (sugere-se Bootstrap, Tailwind, ou CSS flexível).
- [ ] **Diferencial Técnico:** Implementar pelo menos uma funcionalidade extra:
    - Upload e associação de imagens para produtos.
    - Testes unitários no front-end (Jest / React Testing Library).
    - Deploy/Hospedagem da aplicação (Vercel, Netlify, Render, etc.).

---

## 📚 Conteúdos Vistos em Aula Aplicados ao Projeto

Com base no cronograma da disciplina, os seguintes tópicos devem guiar a implementação:

1.  **Conceitos de SPA (Aula 11):** Manipulação dinâmica do DOM, requisições assíncronas (AJAX/Fetch) e arquitetura cliente-servidor.
2.  **Introdução ao React (Aulas 12 e 13):** Criação de componentes, passagem de propriedades (`Props`), manipulação de eventos, renderização condicional e de listas.
3.  **Hooks Básicos (Aula 13):**
    *   `useState`: Gerenciamento do estado local da interface (ex: dados do formulário, carregamento, erros).
    *   `useEffect`: Execução de efeitos colaterais, principalmente a busca de dados na API quando o componente é montado.
4.  **Formulários no React (Aula 15):** Controlled Components, validação de campos obrigatórios, estados de envio e tratamento de erros de validação da API.
5.  **Consumo de API com Axios (Aula 15):** Criação de uma instância do Axios configurada com a `baseURL` da API e interceptores para injetar o Token JWT.
6.  **React Router (Aula 15):** Navegação declarativa sem recarregamento de página utilizando `<BrowserRouter>`, `<Routes>`, `<Route>`, `<Link>` e hooks como `useNavigate` e `useParams`.
7.  **Autenticação e Proteção de Rotas (Aula 16):** Criação de um contexto de autenticação (`AuthContext`) para gerenciar o estado global de login do usuário e rotas privadas protegidas que redirecionam usuários não autenticados.
8.  **Integração Front/Back e CORS (Aula 16):** Habilitação de requisições Cross-Origin Resource Sharing no servidor para permitir que o front-end acesse o back-end.

---

## ⚡ Ajuste Crucial no Back-end: Configurando o CORS

Por padrão, navegadores bloqueiam requisições de origens diferentes (ex: o front React rodando em `http://localhost:5173` tentando acessar o back Express em `http://localhost:3000`). Como o back-end original do Trabalho 1 não possui o CORS habilitado, você **deve** realizar o seguinte ajuste na pasta do back-end (`trabalho_full_stack_07_05`):

1. Instale o pacote CORS e seus tipos de desenvolvimento no back-end:
   ```bash
   npm install cors
   npm install --save-dev @types/cors
   ```

2. Abra o arquivo `src/app.ts` do seu back-end e importe/configure o middleware:
   ```typescript
   import cors from 'cors';
   
   // ... outras importações ...

   const app = express();

   // Habilitar CORS para todas as origens
   app.use(cors());

   // Ou habilitar apenas para a porta do React:
   // app.use(cors({ origin: 'http://localhost:5173' }));

   app.use(express.json());
   // ... restante da inicialização ...
   ```

---

## 🚀 Como Iniciar o Projeto Front-end (React + Vite)

Para criar o projeto front-end do zero com React, TypeScript e Vite dentro da pasta `trabalho_fullstack_2`:

1. Crie o scaffold do projeto React:
   ```bash
   npm create vite@latest frontend -- --template react-ts
   ```
2. Acesse a pasta criada e instale as dependências essenciais:
   ```bash
   cd frontend
   npm install
   npm install react-router-dom axios lucide-react
   ```
3. Para estilização responsiva, escolha seu framework favorito (ex: Bootstrap ou Tailwind) ou utilize CSS customizado. Para instalar o Bootstrap:
   ```bash
   npm install bootstrap
   ```
   *Depois, importe-o no seu `src/main.tsx`: `import 'bootstrap/dist/css/bootstrap.min.css';`*

4. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
