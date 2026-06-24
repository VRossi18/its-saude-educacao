import { createClient } from "@supabase/supabase-js";

export async function fetchCursoIdsForStaticExport(): Promise<number[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return [];
  }

  const supabase = createClient(url, key);
  const { data, error } = await supabase
    .from("cursos")
    .select("id")
    .eq("ativo", true);

  if (error) {
    console.warn("generateStaticParams: falha ao buscar cursos", error.message);
    return [];
  }

  return (data ?? []).map((curso) => curso.id);
}
