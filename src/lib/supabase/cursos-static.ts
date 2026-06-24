import { createClient } from "@supabase/supabase-js";

const FETCH_TIMEOUT_MS = 15_000;

async function withTimeout<T>(
  promise: PromiseLike<T>,
  ms: number,
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(
      () => reject(new Error(`Supabase request timed out after ${ms}ms`)),
      ms,
    );
  });

  try {
    return await Promise.race([Promise.resolve(promise), timeout]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export async function fetchCursoIdsForStaticExport(): Promise<number[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return [];
  }

  try {
    const supabase = createClient(url, key);
    const { data, error } = await withTimeout(
      supabase.from("cursos").select("id").eq("ativo", true),
      FETCH_TIMEOUT_MS,
    );

    if (error) {
      console.warn("generateStaticParams: falha ao buscar cursos", error.message);
      return [];
    }

    return (data ?? []).map((curso) => curso.id);
  } catch (error) {
    const message = error instanceof Error ? error.message : "erro desconhecido";
    console.warn("generateStaticParams: falha ao buscar cursos", message);
    return [];
  }
}
