# Bingo2Gether - Monorepo

Sistema de bingo financeiro para casais com backend completo.

## Estrutura do Projeto

```
bingo2gether/
├── frontend/          # App React (Vite + TypeScript)
├── backend/           # API REST (Express + TypeScript + Prisma)
├── docker-compose.yml # PostgreSQL + Redis local
└── package.json       # Workspace root
```

## Setup Inicial

### 1. Instalar Dependências

```bash
# Root
npm install

# Frontend
cd frontend && npm install

# Backend
cd backend && npm install
```

### 2. Configurar Banco de Dados Local

**Opção A: Docker (Recomendado)**

```bash
docker-compose up -d
```

**Opção B: Instalação Manual**

- PostgreSQL 16+
- Redis 7+

### 3. Configurar Variáveis de Ambiente

```bash
# Frontend
cp frontend/.env.example frontend/.env

# Backend
cp backend/.env.example backend/.env
```

Edite os arquivos `.env` com suas credenciais.

### 4. Executar Migrations

```bash
cd backend
npx prisma migrate dev
```

### 5. Iniciar Desenvolvimento

```bash
# Ambos (frontend + backend)
npm run dev

# Ou separadamente
npm run dev:frontend
npm run dev:backend
```

## URLs de Desenvolvimento

- Frontend: <http://localhost:5173>
- Backend API: <http://localhost:3001>
- PostgreSQL: localhost:5432
- Redis: localhost:6379

## Comandos Úteis

```bash
# Testes
npm test

# Build produção
npm run build

# Prisma Studio (visualizar DB)
cd backend && npx prisma studio
```

## Próximos Passos

1. Criar contas nos serviços (ver `docs/setup-services.md`)
2. Configurar OAuth (Google + Facebook)
3. Configurar pagamentos (Stripe + Mercado Pago)
4. Gerar chaves VAPID para push notifications

## Documentação

- [Setup de Serviços](docs/setup-services.md)
- [Arquitetura](docs/architecture.md)
- [API Reference](docs/api.md)
