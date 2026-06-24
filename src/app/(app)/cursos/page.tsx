"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BookOpen } from "lucide-react";

import { CursoCard } from "@/components/courses/curso-card";
import { listCursos } from "@/lib/supabase/cursos";
import { parseApiError } from "@/lib/errors";
import type { Curso } from "@/lib/types/api";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CursosPage() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCursos() {
      try {
        const data = await listCursos();
        setCursos(data);
      } catch (error) {
        toast.error(parseApiError(error));
      } finally {
        setIsLoading(false);
      }
    }

    loadCursos();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Cursos</h1>
        <p className="mt-2 text-muted-foreground">
          Explore os cursos disponíveis e continue seu aprendizado.
        </p>
      </div>

      {cursos.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader className="items-center text-center">
            <div className="mb-2 inline-flex size-12 items-center justify-center rounded-full bg-muted">
              <BookOpen className="size-6 text-muted-foreground" />
            </div>
            <CardTitle>Nenhum curso disponível</CardTitle>
            <CardDescription>
              Assim que novos cursos forem publicados, eles aparecerão aqui.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cursos.map((curso) => (
            <CursoCard key={curso.id} curso={curso} />
          ))}
        </div>
      )}
    </div>
  );
}
