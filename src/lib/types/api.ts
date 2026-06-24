export type UserRole = "aluno" | "professor" | "admin";

export interface AuthUser {
  id: string;
  email: string;
  nome?: string | null;
}

export interface AuthSession {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  user: AuthUser;
  message?: string;
}

export interface MessageResponse {
  message: string;
}

export interface UserProfile {
  id: string;
  email: string;
  nome: string;
  role: UserRole;
  created_at: string;
}

export interface CursoVideo {
  id: number;
  titulo: string;
  youtube_url: string;
  video_id: string | null;
  ordem: number;
}

export interface Curso {
  id: number;
  nome: string;
  descricao: string | null;
  curso_videos: CursoVideo[];
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  email: string;
  password: string;
  nome: string;
}

export interface RecoverPasswordPayload {
  email: string;
}

export interface UpdatePasswordPayload {
  password: string;
}
