"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { updatePassword } from "@/lib/supabase/auth";
import { PasswordInput } from "@/components/auth/password-input";
import { parseApiError } from "@/lib/errors";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/lib/validations/auth";
import { createClient } from "@/utils/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [canReset, setCanReset] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    const supabase = createClient();

    const syncSession = (hasSession: boolean) => {
      setCanReset(hasSession);
      setCheckingSession(false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      syncSession(Boolean(session));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        syncSession(Boolean(session));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!canReset) {
      toast.error("Sessão de recuperação inválida ou expirada.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await updatePassword(values.password);
      toast.success(response.message);
      router.push("/auth/login");
    } catch (error) {
      toast.error(parseApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (checkingSession) {
    return (
      <Card className="border-border/80 shadow-lg">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/80 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Nova senha</CardTitle>
        <CardDescription>
          Defina uma nova senha para acessar sua conta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!canReset && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Link inválido</AlertTitle>
            <AlertDescription>
              Não foi possível validar o link de recuperação. Solicite um novo
              e-mail em{" "}
              <Link href="/auth/forgot-password" className="underline">
                recuperar senha
              </Link>
              .
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Nova senha</Label>
            <PasswordInput
              id="password"
              autoComplete="new-password"
              placeholder="••••••••"
              aria-invalid={Boolean(errors.password)}
              disabled={!canReset}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !canReset}
          >
            {isSubmitting ? "Atualizando..." : "Atualizar senha"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/auth/login" className="text-primary hover:underline">
            Voltar ao login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
