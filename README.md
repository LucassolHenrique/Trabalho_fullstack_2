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
