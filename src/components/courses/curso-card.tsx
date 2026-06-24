import Link from "next/link";
import { PlayCircle, Video } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Curso } from "@/lib/types/api";

interface CursoCardProps {
  curso: Curso;
}

export function CursoCard({ curso }: CursoCardProps) {
  const videoCount = curso.curso_videos.length;

  return (
    <Link href={`/cursos/${curso.id}`} className="group block h-full">
      <Card className="h-full border-border/80 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
        <CardHeader>
          <div className="mb-2 inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <PlayCircle className="size-5" />
          </div>
          <CardTitle className="text-xl group-hover:text-primary">
            {curso.nome}
          </CardTitle>
          <CardDescription className="line-clamp-3">
            {curso.descricao ?? "Sem descrição disponível."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Video className="size-4" />
            {videoCount} {videoCount === 1 ? "vídeo" : "vídeos"}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
