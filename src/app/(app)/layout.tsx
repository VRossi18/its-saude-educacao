"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { BookOpen, LogOut, UserRound } from "lucide-react";

import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-context";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/cursos", label: "Cursos", icon: BookOpen },
  { href: "/perfil", label: "Perfil", icon: UserRound },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user, isAuthenticated, isLoading } = useAuth();
  const mounted = useMounted();

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [mounted, isAuthenticated, isLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  const showShell = mounted && !isLoading && isAuthenticated;

  return (
    <div className="relative min-h-screen bg-secondary/40">
      {!showShell && (
        <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
          Carregando...
        </div>
      )}

      <div className={cn(!showShell && "invisible absolute h-0 overflow-hidden")}>
        <header className="sticky top-0 z-30 border-b border-border/80 bg-background/90 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
            <Link href="/cursos">
              <BrandLogo size="sm" />
            </Link>

            <nav className="hidden items-center gap-1 sm:flex">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              {user?.nome && (
                <span className="hidden text-sm text-muted-foreground md:inline">
                  Olá, {user.nome.split(" ")[0]}
                </span>
              )}
              <ThemeToggle />
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
