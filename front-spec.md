# Front-end Specification — ITS Educação

Você está desenvolvendo o front-end da plataforma de cursos médicos da **ITS Educação**[cite: 1, 2]. Siga estritamente as diretrizes de arquitetura, stack tecnológica, paleta de cores e integração com o backend descritas abaixo.

---

## 1. Stack Tecnológica Base

O projeto deve ser construído utilizando as seguintes ferramentas:

- **Framework:** React (Vite ou Next.js App Router) com TypeScript
- **Estilização:** Tailwind CSS (com suporte a Dark Mode baseado na classe `.dark`)
- **Componentes de UI:** shadcn/ui (radix-ui bases)
- **Ícones:** lucide-react
- **Gerenciamento de Estado/Queries:** Axios (ou Fetch nativo) com Context API para Autenticação.

---

## 2. Identidade Visual & Paleta de Cores (ITS Educação)

O design deve transmitir profissionalismo, confiança e clareza (ambiente médico/educacional)[cite: 1, 2].

### Light Mode (Padrão)

- **Fundo Principal:** `#FFFFFF` (Branco Puro) ou `#F8FAFC` (Slate-50) para backgrounds de seções.
- **Cor Primária (Azul ITS):** `#0284C7` (Sky-600) ou `#1E40AF` (Blue-800) representando o azul institucional médico[cite: 1, 2].
- **Textos:** `#0F172A` (Slate-900) para títulos; `#475569` (Slate-600) para corpos de texto.
- **Bordas/Divisores:** `#E2E8F0` (Slate-200).

### Dark Mode (Obrigatório)

- **Fundo Principal:** `#0F172A` (Slate-900).
- **Fundo de Cards/Formulários:** `#1E293B` (Slate-800).
- **Cor Primária (Azul Ajustado):** `#38BDF8` (Sky-400) para melhor contraste.
- **Textos:** `#F8FAFC` (Slate-50) para títulos; `#94A3B8` (Slate-400) para corpos de texto.

---

## 3. Escopo Inicial de Telas (Fluxo de Autenticação)

### Tela 1: Login (`/auth/login`)

- **Layout:** Tela dividida (Split screen ou card centralizado). Um lado com uma imagem ou grafismo institucional discreto voltado para a saúde/educação médica e a logo da **ITS Educação**[cite: 1]; o outro lado com o formulário de login.
- **Campos:**
   - E-mail (`input[type="email"]`) — Obrigatório e validado.
   - Senha (`input[type="password"]`) — Mínimo de 8 caracteres, com botão de "olho" para revelar a senha.
- **Ações:**
   - Botão "Entrar" (Estado de Loading ativo durante a requisição).
   - Link para "Esqueceu sua senha?" (Redireciona ou abre fluxo de recuperação).
   - Link/Seção secundária: "Não tem uma conta? Cadastre-se".
- **Integração:** `POST /api/v1/auth/login`[cite: 2].

### Tela 2: Criação de Usuário / Cadastro (`/auth/signup`)

- **Layout:** Consistente com a tela de login.
- **Campos:**
   - Nome Completo (`input[type="text"]`) — Obrigatório[cite: 2].
   - E-mail (`input[type="email"]`) — Obrigatório[cite: 2].
   - Senha (`input[type="password"]`) — Obrigatório, mínimo de 8 caracteres[cite: 2].
- **Ações:**
   - Botão "Criar Conta" (Com feedback de loading)[cite: 2].
   - Link para "Já possui uma conta? Faça login".
- **Feedback Visual:** Tratar de forma explícita o retorno `201` com mensagem de sucesso ou aviso de "Verifique seu e-mail para confirmar a conta" (caso a confirmação esteja ativada no Supabase)[cite: 2].
- **Integração:** `POST /api/v1/auth/signup`[cite: 2].

### Componente Global: Alternador de Tema (Dark/Light Mode)

- Um botão flutuante ou no cabeçalho usando o ícone `Sun` e `Moon` da biblioteca `lucide-react` para chavear a classe `dark` no elemento `<html>`.

---

## 4. Arquitetura de Código & Integração de API

Siga o contrato de API fornecido[cite: 2]. Certifique-se de implementar os seguintes padrões de código:

1. **HttpClient Global:** Criar uma instância pré-configurada do Axios/Fetch com o prefixo `/api/v1` e um interceptor injetando o `Authorization: Bearer <token>` quando armazenado localmente[cite: 2].
2. **Gerenciamento de Sessão:** Armazenar de forma segura o `access_token`, `refresh_token` e dados do `user` (id, email, nome) após o login/cadastro bem-sucedido[cite: 2].
3. **Tratamento de Erros:** Exibir mensagens de erro amigáveis interceptando o formato padrão do NestJS (`statusCode`, `message` - que pode ser uma string ou array de validações do class-validator)[cite: 2].

### Tipos TypeScript a serem gerados baseados no Backend:

```ts
export type UserRole = "aluno" | "professor" | "admin";[cite: 2]

export interface AuthUser {
  id: string;
  email: string;
  nome?: string | null;
}[cite: 2]

export interface AuthSession {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  user: AuthUser;
  message?: string;
}[cite: 2]
```
