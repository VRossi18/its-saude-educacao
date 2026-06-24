# ITS Educação — Portal Front-end

Front-end da plataforma de cursos médicos da ITS Educação, construído com Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui e **Supabase** como BaaS.

## Requisitos

- Node.js 20+
- pnpm 10+
- Projeto Supabase configurado (Auth + tabelas `profiles`, `cursos`, `curso_videos`)

## Configuração

1. Instale as dependências:

```bash
pnpm install
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

- Site URL (dev): `http://localhost:3001`
- Redirect URLs:
  - `http://localhost:3001/auth/callback`
  - `http://localhost:3001/auth/reset-password`
  - `https://<user>.github.io/its-saude-educacao/auth/callback`
  - `https://<user>.github.io/its-saude-educacao/auth/reset-password`

## Desenvolvimento

```bash
pnpm dev
```

O front sobe em [http://localhost:3001](http://localhost:3001).

## Testes e qualidade

```bash
pnpm test              # testes unitários (Vitest)
pnpm test:watch        # modo watch
pnpm test:coverage     # cobertura
pnpm typecheck         # verificação TypeScript
pnpm lint              # ESLint
pnpm ci:verify         # lint + typecheck + test (CI local)
```

## Build

```bash
# Desenvolvimento / servidor Node
pnpm build

# Simular build do GitHub Pages localmente
GITHUB_PAGES=true NEXT_PUBLIC_BASE_PATH=/its-saude-educacao pnpm build
```

O deploy no GitHub Pages gera a pasta `out/` com `output: 'export'`.

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

## CI/CD (GitHub Actions)

O workflow [`.github/workflows/pipeline.yml`](.github/workflows/pipeline.yml) executa:

1. `pnpm lint` + `pnpm typecheck` + `pnpm test`
2. `pnpm build` com `GITHUB_PAGES=true` (artefato em `out/`)
3. Deploy automático no GitHub Pages (branch `main`)

### Secrets necessários no repositório

| Secret | Uso |
|--------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | Build estático + `generateStaticParams` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Build estático |

### Configuração do GitHub Pages

Em **Settings → Pages → Build and deployment**, defina **Source** como **GitHub Actions** (não “Deploy from a branch”).

Se o environment `github-pages` tiver regra de aprovação manual, o deploy fica pendente até alguém aprovar.

### URL de produção (GitHub Pages)

`https://<user>.github.io/its-saude-educacao/`

## Integração Supabase

- **Auth:** login, signup, recuperação e reset de senha via `@supabase/supabase-js`
- **Sessão:** cookies gerenciados por `@supabase/ssr` + `proxy.ts` (dev/Node)
- **GitHub Pages:** proteção de rotas via guarda client-side no layout autenticado
- **Dados:** cursos e perfil consultados nas tabelas Supabase
- **Clientes:** `src/utils/supabase/client.ts` (browser) e `server.ts` (Server Components)

## Especificações

- [`front-spec.md`](front-spec.md) — diretrizes de UI e autenticação
- [`frontend-api-spec.md`](frontend-api-spec.md) — referência de domínio (schema/tipos)
