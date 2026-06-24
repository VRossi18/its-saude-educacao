# ITS Educação — Portal Front-end

Front-end da plataforma de cursos médicos da ITS Educação, construído com Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui e **Supabase** como BaaS.

## Requisitos

- Node.js 20+
- Projeto Supabase configurado (Auth + tabelas `profiles`, `cursos`, `curso_videos`)

## Configuração

1. Instale as dependências:

```bash
npm install
```

2. Copie o arquivo de ambiente:

```bash
cp .env.local.example .env.local
```

Variáveis necessárias:

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Chave publishable (anon) do Supabase |

3. Adicione a logo institucional em `public/logo.png`.

4. No **Supabase Dashboard → Authentication → URL Configuration**, cadastre:

- Site URL: `http://localhost:3001`
- Redirect URLs:
  - `http://localhost:3001/auth/callback`
  - `http://localhost:3001/auth/reset-password`

## Desenvolvimento

```bash
npm run dev
```

O front sobe em [http://localhost:3001](http://localhost:3001).

## Rotas

| Rota | Descrição |
|------|-----------|
| `/auth/login` | Login via Supabase Auth |
| `/auth/signup` | Cadastro |
| `/auth/forgot-password` | Recuperação de senha |
| `/auth/reset-password` | Redefinição de senha (link do e-mail) |
| `/auth/callback` | Callback OAuth / confirmação de e-mail |
| `/cursos` | Listagem de cursos (protegida) |
| `/cursos/[id]` | Detalhe do curso com vídeos (protegida) |
| `/perfil` | Perfil do usuário (protegida) |

## Scripts

- `npm run dev` — servidor de desenvolvimento
- `npm run build` — build de produção
- `npm run start` — servidor de produção
- `npm run lint` — lint do projeto

## Integração Supabase

- **Auth:** login, signup, recuperação e reset de senha via `@supabase/supabase-js`
- **Sessão:** cookies gerenciados por `@supabase/ssr` + middleware que renova a sessão
- **Dados:** cursos e perfil consultados diretamente nas tabelas Supabase
- **Clientes:** `src/utils/supabase/client.ts` (browser) e `server.ts` (Server Components / Route Handlers)

## Especificações

- [`front-spec.md`](front-spec.md) — diretrizes de UI e autenticação
- [`frontend-api-spec.md`](frontend-api-spec.md) — referência de domínio (schema/tipos)
