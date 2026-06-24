import type { CursoVideo } from "@/lib/types/api";

export function sortVideos(videos: CursoVideo[]): CursoVideo[] {
  return [...videos].sort((a, b) => a.ordem - b.ordem);
}
