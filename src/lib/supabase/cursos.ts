import { createClient } from "@/utils/supabase/client";
import { sortVideos } from "@/lib/cursos-utils";
import type { Curso, CursoVideo } from "@/lib/types/api";

export async function listCursos(): Promise<Curso[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("cursos")
    .select(
      `
      id,
      nome,
      descricao,
      curso_videos (
        id,
        titulo,
        youtube_url,
        video_id,
        ordem
      )
    `,
    )
    .eq("ativo", true);

  if (error) throw error;

  return (data ?? []).map((curso) => ({
    id: curso.id,
    nome: curso.nome,
    descricao: curso.descricao,
    curso_videos: sortVideos((curso.curso_videos ?? []) as CursoVideo[]),
  }));
}

export async function getCursoById(id: number): Promise<Curso> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("cursos")
    .select(
      `
      id,
      nome,
      descricao,
      curso_videos (
        id,
        titulo,
        youtube_url,
        video_id,
        ordem
      )
    `,
    )
    .eq("id", id)
    .eq("ativo", true)
    .single();

  if (error) throw error;

  return {
    id: data.id,
    nome: data.nome,
    descricao: data.descricao,
    curso_videos: sortVideos((data.curso_videos ?? []) as CursoVideo[]),
  };
}
