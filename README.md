# AgendamentoFácil - Protótipo SaaS

Plataforma de agendamento para profissionais brasileiros (manicures, barbeiros, personal trainers, etc.) com foco em WhatsApp.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Linguagem**: TypeScript
- **Estilização**: TailwindCSS + shadcn/ui
- **Banco de Dados**: PostgreSQL (via Prisma ORM)
- **Auth**: NextAuth.js (Credentials)

## Configuração do Ambiente

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Configurar Variáveis de Ambiente**:
   O arquivo `.env` já foi criado com valores de exemplo. Para produção, atualize `DATABASE_URL` e segredos do NextAuth/WhatsApp.

   ```env
   DATABASE_URL="postgresql://user:password@host:5432/db"
   NEXTAUTH_SECRET="change_me"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. **Banco de Dados**:
   Certifique-se de ter um banco PostgreSQL rodando.
   Atualize a `DATABASE_URL` no `.env`.

   Execute as migrações (se tiver o banco conectado):
   ```bash
   npx prisma migrate dev --name init
   ```
   
   *Nota: Como este é um protótipo inicial, se você não tiver um banco rodando, o Prisma Client foi gerado mas as queries falharão em tempo de execução.*

4. **Rodar o projeto**:
   ```bash
   npm run dev
   ```
   Acesse [http://localhost:3000](http://localhost:3000).

## Funcionalidades Implementadas

- **Landing Page**: Página inicial de marketing.
- **Autenticação**: Login e Cadastro (Email/Senha).
- **Dashboard (Agenda)**: Visualização dos agendamentos do dia.
- **Agendamento Público**: Link `/b/[slug]` para clientes agendarem.
- **Cancelamento**: Link de cancelamento fácil `/cancel/[id]`.
- **Lista de Espera**: Lógica (stub) para oferecer horários vagos.
- **WhatsApp**: Stubs para envio de mensagens.
- **Configuração**: UI para configurar respostas automáticas.

## Estrutura de Pastas

- `src/app`: Rotas e páginas (App Router).
- `src/lib`: Utilitários (Prisma, Auth, WhatsApp, Waitlist).
- `prisma`: Schema do banco de dados.
- `src/components`: Componentes UI.

## Próximos Passos

- Integração real com WhatsApp Cloud API.
- Implementação de IA para respostas automáticas.
- Melhoria na lógica de horários disponíveis (overlap, intervalos).
- Integração com gateway de pagamento (opcional).
