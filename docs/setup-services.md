# Guia de Configuração de Serviços

Este guia detalha como configurar cada serviço externo necessário para o Bingo2Gether.

## 📋 Checklist Rápido

- [ ] Stripe (Pagamentos)
- [ ] Mercado Pago (Pagamentos BR)
- [ ] Google OAuth (Login social)
- [ ] Facebook OAuth (Login social)
- [ ] VAPID Keys (Push notifications)
- [ ] PostgreSQL (Banco de dados)
- [ ] Redis (Cache/Sessions)

---

## 1. Stripe

### Criar Conta

1. Acesse [stripe.com](https://stripe.com)
2. Clique em "Sign up"
3. Preencha os dados da empresa

### Configurar Modo de Teste

1. No dashboard, ative o "Test mode" (toggle no canto superior direito)
2. Vá em **Developers → API keys**
3. Copie as chaves:
   - **Publishable key** → Cole em `frontend/.env` como `VITE_STRIPE_PUBLIC_KEY`
   - **Secret key** → Cole em `backend/.env` como `STRIPE_SECRET_KEY`

### Criar Produto PRO

1. Vá em **Products → Add product**
2. Preencha:
   - Nome: `Bingo2Gether PRO`
   - Descrição: `Acesso a recursos premium`
   - Pricing: `Recurring` → `Monthly`
   - Preço: `R$ 9,90` (ou USD equivalente)
3. Clique em **Save product**
4. Copie o **Price ID** (começa com `price_...`)
5. Cole em `backend/.env` como `STRIPE_PRICE_ID`

### Configurar Webhook

1. Vá em **Developers → Webhooks**
2. Clique em **Add endpoint**
3. URL do endpoint:
   - Dev: `http://localhost:3001/api/payment/webhook`
   - Prod: `https://api.bingo2gether.com/api/payment/webhook`
4. Selecione eventos:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copie o **Signing secret** (começa com `whsec_...`)
6. Cole em `backend/.env` como `STRIPE_WEBHOOK_SECRET`

### Testar com Stripe CLI (Opcional)

```bash
# Instalar Stripe CLI
# Windows: scoop install stripe
# Mac: brew install stripe/stripe-cli/stripe

# Login
stripe login

# Escutar webhooks localmente
stripe listen --forward-to localhost:3001/api/payment/webhook
```

**Cartões de teste:**

- Sucesso: `4242 4242 4242 4242`
- Falha: `4000 0000 0000 0002`
- 3D Secure: `4000 0027 6000 3184`

---

## 2. Mercado Pago

### Criar Conta

1. Acesse [mercadopago.com.br](https://www.mercadopago.com.br)
2. Crie uma conta de vendedor

### Obter Credenciais

1. Vá em **Seu negócio → Configurações → Credenciais**
2. Ative o **Modo de teste** (sandbox)
3. Copie as credenciais de teste:
   - **Public key** (começa com `TEST-...`) → `frontend/.env` como `VITE_MP_PUBLIC_KEY`
   - **Access token** (começa com `TEST-...`) → `backend/.env` como `MP_ACCESS_TOKEN`

### Criar Plano de Assinatura

1. Vá em **Vendas → Assinaturas**
2. Clique em **Criar plano**
3. Preencha:
   - Nome: `Bingo2Gether PRO`
   - Valor: `R$ 9,90`
   - Frequência: `Mensal`
4. Copie o **Plan ID**
5. Cole em `backend/.env` como `MP_PLAN_ID`

### Configurar Webhook

1. Vá em **Seu negócio → Configurações → Webhooks**
2. Adicione uma nova URL:
   - Dev: `http://localhost:3001/api/payment/webhook`
   - Prod: `https://api.bingo2gether.com/api/payment/webhook`
3. Selecione eventos:
   - `payment`
   - `subscription`
4. Copie o **Secret** gerado
5. Cole em `backend/.env` como `MP_WEBHOOK_SECRET`

**Usuários de teste:**

- Comprador: Use o gerador de usuários de teste no painel
- Vendedor: Sua conta principal

---

## 3. Google OAuth

### Criar Projeto

1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Clique em **Select a project → New Project**
3. Nome: `Bingo2Gether`
4. Clique em **Create**

### Ativar Google+ API

1. No menu lateral, vá em **APIs & Services → Library**
2. Procure por "Google+ API"
3. Clique em **Enable**

### Criar Credenciais OAuth

1. Vá em **APIs & Services → Credentials**
2. Clique em **Create Credentials → OAuth 2.0 Client ID**
3. Configure a tela de consentimento (se solicitado):
   - User Type: **External**
   - App name: `Bingo2Gether`
   - User support email: seu email
   - Developer contact: seu email
4. Application type: **Web application**
5. Name: `Bingo2Gether Web`
6. Authorized redirect URIs:
   - `http://localhost:3001/api/auth/google/callback`
   - `https://api.bingo2gether.com/api/auth/google/callback` (produção)
7. Clique em **Create**
8. Copie as credenciais:
   - **Client ID** → `backend/.env` como `GOOGLE_CLIENT_ID` E `frontend/.env` como `VITE_GOOGLE_CLIENT_ID`
   - **Client secret** → `backend/.env` como `GOOGLE_CLIENT_SECRET`

---

## 4. Facebook OAuth

### Criar App

1. Acesse [developers.facebook.com](https://developers.facebook.com)
2. Clique em **My Apps → Create App**
3. Tipo: **Consumer**
4. Nome: `Bingo2Gether`
5. Email de contato: seu email

### Adicionar Facebook Login

1. No dashboard do app, clique em **Add Product**
2. Encontre **Facebook Login** e clique em **Set Up**
3. Plataforma: **Web**
4. Site URL: `http://localhost:5173` (dev) ou `https://bingo2gether.com` (prod)

### Configurar OAuth Redirect

1. No menu lateral, vá em **Facebook Login → Settings**
2. Em **Valid OAuth Redirect URIs**, adicione:
   - `http://localhost:3001/api/auth/facebook/callback`
   - `https://api.bingo2gether.com/api/auth/facebook/callback`
3. Salve as mudanças

### Obter Credenciais

1. Vá em **Settings → Basic**
2. Copie:
   - **App ID** → `backend/.env` como `FACEBOOK_APP_ID` E `frontend/.env` como `VITE_FACEBOOK_APP_ID`
   - **App Secret** (clique em Show) → `backend/.env` como `FACEBOOK_APP_SECRET`

---

## 5. VAPID Keys (Push Notifications)

### Gerar Chaves

```bash
# Instalar web-push globalmente
npm install -g web-push

# Gerar chaves VAPID
web-push generate-vapid-keys
```

### Configurar

1. Copie a saída do comando acima
2. **Public Key** → `frontend/.env` como `VITE_VAPID_PUBLIC_KEY`
3. **Private Key** → `backend/.env` como `VAPID_PRIVATE_KEY`
4. Em `backend/.env`, adicione:

   ```
   VAPID_SUBJECT=mailto:seu-email@bingo2gether.com
   ```

---

## 6. PostgreSQL (Local com Docker)

### Opção A: Docker Compose (Recomendado)

```bash
# Na raiz do projeto
docker-compose up -d
```

Isso iniciará PostgreSQL e Redis automaticamente.

### Opção B: Instalação Manual

1. Baixe PostgreSQL 16+ em [postgresql.org](https://www.postgresql.org/download/)
2. Instale com as configurações padrão
3. Crie um banco de dados:

   ```sql
   CREATE DATABASE bingo2gether_dev;
   CREATE USER bingo2gether WITH PASSWORD 'dev_password_123';
   GRANT ALL PRIVILEGES ON DATABASE bingo2gether_dev TO bingo2gether;
   ```

4. Em `backend/.env`:

   ```
   DATABASE_URL=postgresql://bingo2gether:dev_password_123@localhost:5432/bingo2gether_dev
   ```

---

## 7. Redis (Local com Docker)

### Opção A: Docker Compose (Recomendado)

Já incluído no `docker-compose up -d`

### Opção B: Instalação Manual

1. Windows: Baixe Redis em [redis.io/download](https://redis.io/download) ou use WSL
2. Mac: `brew install redis`
3. Linux: `sudo apt-get install redis-server`
4. Inicie o serviço:

   ```bash
   redis-server
   ```

5. Em `backend/.env`:

   ```
   REDIS_URL=redis://localhost:6379
   ```

---

## 8. Gerar Secrets de Segurança

### JWT e Session Secrets

```bash
# No terminal (Node.js)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Execute este comando **duas vezes** e cole os resultados em `backend/.env`:

```
JWT_SECRET=<primeiro_resultado>
SESSION_SECRET=<segundo_resultado>
```

---

## ✅ Verificação Final

Após configurar tudo, seus arquivos `.env` devem estar assim:

### `frontend/.env`

```bash
VITE_API_URL=http://localhost:3001/api
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_MP_PUBLIC_KEY=TEST-...
VITE_GOOGLE_CLIENT_ID=...apps.googleusercontent.com
VITE_FACEBOOK_APP_ID=...
VITE_VAPID_PUBLIC_KEY=...
```

### `backend/.env`

```bash
DATABASE_URL=postgresql://bingo2gether:dev_password_123@localhost:5432/bingo2gether_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=...
SESSION_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FACEBOOK_APP_ID=...
FACEBOOK_APP_SECRET=...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...
MP_ACCESS_TOKEN=TEST-...
MP_WEBHOOK_SECRET=...
MP_PLAN_ID=...
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=mailto:...
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

---

## 🚀 Próximos Passos

1. Copie os arquivos `.env.example` para `.env`:

   ```bash
   cp frontend/.env.example frontend/.env
   cp backend/.env.example backend/.env
   ```

2. Preencha os valores conforme este guia

3. Execute as migrations do Prisma:

   ```bash
   cd backend
   npm install
   npx prisma migrate dev --name init
   ```

4. Inicie o desenvolvimento:

   ```bash
   npm run dev
   ```

---

## 📞 Suporte

Se encontrar problemas, consulte:

- [Documentação Stripe](https://stripe.com/docs)
- [Documentação Mercado Pago](https://www.mercadopago.com.br/developers)
- [Google OAuth Guide](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Docs](https://developers.facebook.com/docs/facebook-login)
