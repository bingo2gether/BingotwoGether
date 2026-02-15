# Clonar BingotwoGether para fresh-start-repo

Este guia explica como clonar o repositório BingotwoGether exatamente como está para um novo repositório chamado `fresh-start-repo`.

## Opções de Clonagem

Existem duas formas principais de clonar este repositório:

### Opção 1: Clone com Histórico Git (Recomendado para Colaboração)

Use esta opção se você deseja:
- Manter todo o histórico de commits
- Contribuir de volta para o projeto original
- Ter acesso a branches antigas e tags

```bash
# Clone o repositório
git clone https://github.com/bingo2gether/BingotwoGether.git fresh-start-repo

# Entre no diretório
cd fresh-start-repo

# Remova o remote origin para evitar pushes acidentais
git remote remove origin

# Adicione seu novo remote
git remote add origin <url-do-seu-novo-repositorio>

# Faça push para o novo repositório
git push -u origin main
```

### Opção 2: Clone sem Histórico Git (Fresh Start)

Use esta opção se você deseja:
- Começar um novo projeto baseado neste template
- Ter um histórico de commits limpo
- Não manter conexão com o repositório original

```bash
# Clone o repositório
git clone https://github.com/bingo2gether/BingotwoGether.git fresh-start-repo

# Entre no diretório
cd fresh-start-repo

# Remova o diretório .git
rm -rf .git

# Inicialize um novo repositório
git init

# Faça o primeiro commit
git add .
git commit -m "Initial commit: Fresh start from BingotwoGether"

# Adicione seu remote
git remote add origin <url-do-seu-novo-repositorio>

# Faça push para o novo repositório
git branch -M main
git push -u origin main
```

## Usando o Script Automatizado

Para facilitar o processo, incluímos um script que automatiza a clonagem:

```bash
# Torne o script executável
chmod +x clone-to-fresh-start.sh

# Execute o script
./clone-to-fresh-start.sh
```

O script irá:
1. Perguntar se você deseja clonar com ou sem histórico git
2. Clonar o repositório no diretório `fresh-start-repo`
3. Configurar o repositório apropriadamente
4. Fornecer instruções para os próximos passos

## Configuração Pós-Clonagem

Após clonar o repositório, você precisa configurá-lo:

### 1. Instalar Dependências

```bash
cd fresh-start-repo

# Root
npm install

# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
cd ..
```

### 2. Configurar Variáveis de Ambiente

```bash
# Copiar templates
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

Edite os arquivos `.env` e preencha as variáveis necessárias:

**backend/.env:**
- `DATABASE_URL`: String de conexão do PostgreSQL
- `REDIS_URL`: String de conexão do Redis
- `JWT_SECRET`: Secret para tokens JWT (gerar novo)
- `SESSION_SECRET`: Secret para sessões (gerar novo)
- `VAPID_PUBLIC_KEY` e `VAPID_PRIVATE_KEY`: Chaves para push notifications

**frontend/.env:**
- `VITE_API_URL`: URL da API backend
- `VITE_VAPID_PUBLIC_KEY`: Mesma chave pública do backend

#### Gerar Secrets

```bash
# Gerar JWT_SECRET e SESSION_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Gerar VAPID Keys
npm install -g web-push
web-push generate-vapid-keys
```

### 3. Configurar Banco de Dados

```bash
# Iniciar PostgreSQL e Redis via Docker
docker-compose up -d

# Executar migrations
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Iniciar Desenvolvimento

```bash
# Na raiz do projeto
npm run dev
```

Acesse:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Prisma Studio: `cd backend && npx prisma studio`

## Personalizando seu Fresh Start

Após clonar, considere personalizar:

### 1. Atualizar package.json

```json
{
  "name": "fresh-start-repo",
  "description": "Seu novo projeto baseado em BingotwoGether",
  "repository": {
    "type": "git",
    "url": "https://github.com/seu-usuario/fresh-start-repo.git"
  }
}
```

### 2. Atualizar README.md

Atualize o README.md com informações do seu novo projeto.

### 3. Atualizar .firebaserc

Se você usar Firebase, atualize o arquivo `.firebaserc` com seu projeto:

```json
{
  "projects": {
    "default": "seu-projeto-firebase"
  }
}
```

### 4. Atualizar render.yaml

Se você usar Render.com, atualize o arquivo `render.yaml` com suas configurações.

## Removendo Configurações Específicas

Você pode querer remover ou modificar:

- **Firebase**: Remover `.firebaserc` e `firebase.json` se não usar
- **Render**: Remover `render.yaml` se não usar Render.com
- **Docker**: Modificar `docker-compose.yml` conforme suas necessidades
- **Docs**: Atualizar ou remover documentação específica do projeto original

## Estrutura do Projeto Clonado

```
fresh-start-repo/
├── frontend/              # App React (Vite + TypeScript)
│   ├── src/
│   ├── public/
│   ├── .env.example
│   └── package.json
├── backend/               # API REST (Express + TypeScript + Prisma)
│   ├── src/
│   ├── prisma/
│   ├── .env.example
│   └── package.json
├── docs/                  # Documentação
├── docker-compose.yml     # PostgreSQL + Redis
├── package.json           # Workspace root
├── README.md
└── QUICKSTART.md
```

## Troubleshooting

### Erro: "Port already in use"

```bash
# Verificar portas em uso
lsof -i :5173  # Frontend
lsof -i :3001  # Backend
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis

# Parar processos ou mudar portas nos arquivos .env
```

### Erro: "Cannot connect to database"

```bash
# Verificar se Docker está rodando
docker ps

# Reiniciar containers
docker-compose down
docker-compose up -d
```

### Erro: "Module not found"

```bash
# Reinstalar dependências
rm -rf node_modules
rm -rf frontend/node_modules
rm -rf backend/node_modules
npm install
cd frontend && npm install
cd ../backend && npm install
```

## Próximos Passos

1. Configure serviços externos (OAuth, Pagamentos) - ver `docs/setup-services.md`
2. Personalize o projeto com seu branding
3. Adicione suas funcionalidades específicas
4. Configure CI/CD para seu novo repositório
5. Configure ambientes de staging e produção

## Recursos Adicionais

- [QUICKSTART.md](../QUICKSTART.md) - Guia rápido de setup
- [README.md](../README.md) - Visão geral do projeto
- [setup-services.md](./setup-services.md) - Configuração de serviços externos

## Suporte

Para questões sobre o projeto original BingotwoGether:
- Repository: https://github.com/bingo2gether/BingotwoGether
- Issues: https://github.com/bingo2gether/BingotwoGether/issues

Para seu novo projeto `fresh-start-repo`, configure seus próprios canais de suporte!
