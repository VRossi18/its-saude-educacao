import type { CursoVideo } from "@/lib/types/api";

export function getEmbedUrl(video: CursoVideo): string | null {
  if (video.video_id) {
    return `https://www.youtube.com/embed/${video.video_id}`;
  }

  if (video.youtube_url.includes("youtu.be/")) {
    const id = video.youtube_url.split("youtu.be/")[1]?.split("?")[0];
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }

  if (video.youtube_url.includes("watch?v=")) {
    const id = new URL(video.youtube_url).searchParams.get("v");
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }

  return null;
}
