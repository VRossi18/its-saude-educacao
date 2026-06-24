"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { VideoEmbed } from "@/components/courses/video-embed";
import { getCursoById } from "@/lib/supabase/cursos";
import { parseApiError } from "@/lib/errors";
import type { Curso } from "@/lib/types/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CursoDetailClient() {
  const params = useParams<{ id: string }>();
  const [curso, setCurso] = useState<Curso | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadCurso() {
      const id = Number(params.id);
      if (Number.isNaN(id)) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      try {
        const data = await getCursoById(id);
        setCurso(data);
      } catch (error) {
        const message = parseApiError(error);
        const isNotFound =
          message.toLowerCase().includes("não encontrado") ||
          message.toLowerCase().includes("0 rows") ||
          (typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "PGRST116");

        if (isNotFound) {
          setNotFound(true);
        } else {
          toast.error(message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadCurso();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="aspect-video w-full rounded-xl" />
      </div>
    );
  }

  if (notFound || !curso) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Curso não encontrado</CardTitle>
          <CardDescription>
            O curso solicitado não existe ou não está mais disponível.
          </CardDescription>
        </CardHeader>
        <div className="px-6 pb-6">
          <Button variant="outline" render={<Link href="/cursos" />}>
            <ArrowLeft className="size-4" />
            Voltar aos cursos
          </Button>
        </div>
      </Card>
    );
  }

  const videos = [...curso.curso_videos].sort((a, b) => a.ordem - b.ordem);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Button variant="ghost" className="px-0" render={<Link href="/cursos" />}>
          <ArrowLeft className="size-4" />
          Voltar aos cursos
        </Button>

        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{curso.nome}</h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            {curso.descricao ?? "Sem descrição disponível."}
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {videos.length === 0 ? (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>Sem vídeos</CardTitle>
              <CardDescription>
                Este curso ainda não possui aulas publicadas.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          videos.map((video, index) => (
            <section key={video.id} className="space-y-3">
              <h2 className="text-lg font-medium">
                Aula {index + 1}: {video.titulo}
              </h2>
              <VideoEmbed video={video} />
            </section>
          ))
        )}
      </div>
    </div>
  );
}
