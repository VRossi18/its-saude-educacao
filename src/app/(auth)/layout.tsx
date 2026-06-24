"use client";

import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Stethoscope } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-background">
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="grid min-h-screen lg:grid-cols-2">
        <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[#1e40af] via-[#0284c7] to-[#0ea5e9] p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_55%)]" />
          <div className="relative z-10">
            <BrandLogo showText className="text-white [&_p]:text-white/90" />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
              <Stethoscope className="size-4" />
              Plataforma médica e educacional
            </div>
            <h1 className="max-w-md text-4xl font-semibold leading-tight">
              Aprendizado clínico com clareza, confiança e excelência.
            </h1>
            <p className="max-w-md text-base text-white/85">
              Acesse cursos, acompanhe aulas em vídeo e gerencie seu perfil em um
              ambiente pensado para a rotina de quem atua na saúde.
            </p>
          </div>
        </aside>

        <main className="flex items-center justify-center px-4 py-10 sm:px-8">
          <div className="w-full max-w-md space-y-8">
            <div className="lg:hidden">
              <BrandLogo />
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
