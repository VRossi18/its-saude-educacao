import type { CursoVideo } from "@/lib/types/api";
import { getEmbedUrl } from "@/lib/youtube";

interface VideoEmbedProps {
  video: CursoVideo;
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
