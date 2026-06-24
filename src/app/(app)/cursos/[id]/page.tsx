import { CursoDetailClient } from "./curso-detail-client";
import { fetchCursoIdsForStaticExport } from "@/lib/supabase/cursos-static";

export async function generateStaticParams() {
  const ids = await fetchCursoIdsForStaticExport();

  if (ids.length > 0) {
    return ids.map((id) => ({ id: String(id) }));
  }

  if (process.env.GITHUB_PAGES === "true") {
    return [{ id: "0" }];
  }

  return [];
}

export default function CursoDetailPage() {
  return <CursoDetailClient />;
}
