import { createClient } from "@/utils/supabase/client";
import type {
  AuthSession,
  LoginPayload,
  MessageResponse,
  SignupPayload,
  UserProfile,
  UserRole,
} from "@/lib/types/api";

function mapAuthSession(
  user: {
    id: string;
    email?: string;
    user_metadata?: { nome?: string };
  },
  session: { access_token: string; refresh_token: string; expires_in?: number } | null,
  message?: string,
): AuthSession {
  return {
    access_token: session?.access_token,
    refresh_token: session?.refresh_token,
    expires_in: session?.expires_in,
    user: {
      id: user.id,
      email: user.email ?? "",
      nome: user.user_metadata?.nome ?? null,
    },
    message,
  };
}

export async function login(payload: LoginPayload): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: payload.email,
    password: payload.password,
  });

  if (error) throw error;
}

export async function signup(payload: SignupPayload): Promise<AuthSession> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      data: { nome: payload.nome },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
  if (!data.user) {
    throw new Error("Não foi possível criar a conta.");
  }

  if (data.session) {
    return mapAuthSession(data.user, data.session);
  }

  return mapAuthSession(
    data.user,
    null,
    "Cadastro realizado. Verifique seu e-mail para confirmar a conta.",
  );
}

export async function recoverPassword(
  email: string,
): Promise<MessageResponse> {
  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });

  if (error) throw error;

  return { message: "Se o e-mail existir, enviaremos instruções." };
}

export async function updatePassword(password: string): Promise<MessageResponse> {
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) throw error;

  await supabase.auth.signOut();

  return { message: "Senha atualizada com sucesso." };
}

export async function getMe(): Promise<UserProfile> {
  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw authError ?? new Error("Usuário não autenticado.");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, email, nome, role, created_at")
    .eq("id", user.id)
    .single();

  if (error) throw error;

  return {
    id: profile.id,
    email: profile.email ?? user.email ?? "",
    nome: profile.nome ?? user.user_metadata?.nome ?? "",
    role: (profile.role as UserRole) ?? "aluno",
    created_at: profile.created_at,
  };
}

export async function deleteMe(): Promise<MessageResponse> {
  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw authError ?? new Error("Usuário não autenticado.");
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", user.id);

  if (profileError) throw profileError;

  await supabase.auth.signOut();

  return { message: "Conta excluída com sucesso." };
}

export async function logout(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
}

export function mapSupabaseUser(user: {
  id: string;
  email?: string;
  user_metadata?: { nome?: string };
}) {
  return {
    id: user.id,
    email: user.email ?? "",
    nome: user.user_metadata?.nome ?? null,
  };
}
