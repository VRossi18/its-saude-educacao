import type { CursoVideo } from "@/lib/types/api";

interface VideoEmbedProps {
  video: CursoVideo;
}

function getEmbedUrl(video: CursoVideo): string | null {
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

export function VideoEmbed({ video }: VideoEmbedProps) {
  const embedUrl = getEmbedUrl(video);

  if (!embedUrl) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 p-6 text-center text-sm text-muted-foreground">
        Não foi possível carregar o vídeo &quot;{video.titulo}&quot;.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-black shadow-sm">
      <div className="aspect-video">
        <iframe
          src={embedUrl}
          title={video.titulo}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
