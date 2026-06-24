"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CalendarDays, Mail, Shield } from "lucide-react";

import { deleteMe } from "@/lib/supabase/auth";
import { useAuth } from "@/lib/auth/auth-context";
import { parseApiError } from "@/lib/errors";
import type { UserProfile, UserRole } from "@/lib/types/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const roleLabels: Record<UserRole, string> = {
  aluno: "Aluno",
  professor: "Professor",
  admin: "Administrador",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
  }).format(new Date(value));
}

export default function PerfilPage() {
  const router = useRouter();
  const { logout, refreshProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await refreshProfile();
        setProfile(data);
      } catch (error) {
        toast.error(parseApiError(error));
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [refreshProfile]);

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.",
    );

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const response = await deleteMe();
      toast.success(response.message);
      await logout();
      router.push("/auth/login");
    } catch (error) {
      toast.error(parseApiError(error));
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Meu perfil</h1>
        <p className="mt-2 text-muted-foreground">
          Gerencie suas informações e preferências da conta.
        </p>
      </div>

      <Card className="max-w-2xl border-border/80">
        <CardHeader>
          <CardTitle>{profile.nome}</CardTitle>
          <CardDescription>Informações da sua conta ITS Educação.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="size-4 text-muted-foreground" />
            <span>{profile.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Shield className="size-4 text-muted-foreground" />
            <span>{roleLabels[profile.role]}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <CalendarDays className="size-4 text-muted-foreground" />
            <span>Membro desde {formatDate(profile.created_at)}</span>
          </div>

          <Separator />

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={async () => {
                await logout();
                router.push("/auth/login");
              }}
            >
              Sair da conta
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? "Excluindo..." : "Excluir conta"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
