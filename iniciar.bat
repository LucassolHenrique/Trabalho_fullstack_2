::
@echo off
:: Garante que estamos executando a partir do diretorio onde o script .bat esta localizado
cd /d "%~dp0"

title Inicializador - Trabalho Full Stack 2

echo =====================================================================
echo    INICIALIZADOR AUTOMATICO DO TRABALHO FULL STACK 2
echo =====================================================================
echo.

:: 1. Verificar se Node.js esta instalado
echo [INFO] Verificando ambiente de execucao...
node -v >nul 2>&1
if %errorlevel% equ 0 goto check_npm
echo [ERRO] O Node.js nao esta instalado ou nao foi adicionado ao PATH do Windows.
echo Por favor, instale o Node.js antes de continuar.
echo Baixe em: https://nodejs.org/
echo.
pause
exit /b 1

:check_npm
call npm -v >nul 2>&1
if %errorlevel% equ 0 goto env_ok
echo [ERRO] O NPM (Node Package Manager) nao esta disponivel.
echo.
pause
exit /b 1

:env_ok
echo [OK] Node.js e NPM detectados com sucesso!
echo.

:: 2. Configurar o Backend
echo =====================================================================
echo [1/2] Configurando o BACKEND...
echo =====================================================================
cd backend

if exist node_modules goto check_db
echo Pasta 'node_modules' nao encontrada no Backend.
echo Instalando as dependencias do backend, por favor aguarde...
call npm install
if %errorlevel% equ 0 goto check_db
echo [ERRO] Erro ao instalar dependencias do backend.
cd ..
pause
exit /b 1

:check_db
echo [OK] Dependencias do backend prontas.

:: Verificar se o banco de dados SQLite existe
if exist database.sqlite goto config_frontend
echo.
echo Banco de dados SQLite (database.sqlite) nao encontrado.
echo Criando e populando o banco com os dados iniciais de teste (seeding)...
call npm run seed
if %errorlevel% equ 0 goto config_frontend
echo [AVISO] Erro ao executar a semeadura (seed) do banco de dados.

:config_frontend
cd ..
echo.

:: 3. Configurar o Frontend
echo =====================================================================
echo [2/2] Configurando o FRONTEND...
echo =====================================================================
cd frontend

if exist node_modules goto start_servers
echo Pasta 'node_modules' nao encontrada no Frontend.
echo Instalando as dependencias do frontend, por favor aguarde...
call npm install
if %errorlevel% equ 0 goto start_servers
echo [ERRO] Erro ao instalar dependencias do frontend.
cd ..
pause
exit /b 1

:start_servers
echo [OK] Dependencias do frontend prontas.
cd ..
echo.

:: 4. Iniciar Servidores em Paralelo
echo =====================================================================
echo INICIALIZANDO OS SERVIDORES DO TRABALHO...
echo =====================================================================
echo.
echo Iniciando a API (Backend) na porta 3000...
start "API Backend - Porta 3000" cmd /k "cd /d \"%~dp0backend\" && title Backend API - Porta 3000 && npm run dev"

echo Iniciando o React App (Frontend) na porta 5173...
start "React Frontend - Porta 5173" cmd /k "cd /d \"%~dp0frontend\" && title Frontend React - Porta 5173 && npm run dev"

echo.
echo =====================================================================
echo    TUDO PRONTO! A aplicacao foi iniciada em duas novas janelas:
echo =====================================================================
echo.
echo * Frontend (React + Vite): http://localhost:5173
echo * Backend (API Express):   http://localhost:3000
echo.
echo Credenciais de Teste para Login:
echo - E-mail: admin@example.com        ^| Senha: senha123 ^| Cargo: Administrador
echo - E-mail: operador@example.com     ^| Senha: senha456 ^| Cargo: Operador
echo - E-mail: visualizador@example.com ^| Senha: senha789 ^| Cargo: Visualizador
echo.
echo Mantenha os terminais do Backend e Frontend abertos para usar o site.
echo.
echo Pressione qualquer tecla para fechar esta janela...
pause > nul
