import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const getUser = vi.fn();

vi.mock("@supabase/ssr", () => ({
  createServerClient: () => ({
    auth: { getUser },
  }),
}));

import { updateSession } from "@/utils/supabase/middleware";

function createRequest(pathname: string) {
  return new NextRequest(new URL(`http://localhost:3001${pathname}`));
}

describe("updateSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redireciona / para login quando não autenticado", async () => {
    getUser.mockResolvedValue({ data: { user: null } });

    const response = await updateSession(createRequest("/"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/auth/login");
  });

  it("redireciona / para cursos quando autenticado", async () => {
    getUser.mockResolvedValue({
      data: { user: { id: "user-1", email: "a@b.com" } },
    });

    const response = await updateSession(createRequest("/"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/cursos");
  });

  it("bloqueia rota protegida sem autenticação", async () => {
    getUser.mockResolvedValue({ data: { user: null } });

    const response = await updateSession(createRequest("/cursos"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/auth/login");
  });

  it("permite /auth/reset-password sem autenticação", async () => {
    getUser.mockResolvedValue({ data: { user: null } });

    const response = await updateSession(createRequest("/auth/reset-password"));

    expect(response.status).toBe(200);
  });

  it("redireciona usuário autenticado fora de reset-password", async () => {
    getUser.mockResolvedValue({
      data: { user: { id: "user-1", email: "a@b.com" } },
    });

    const response = await updateSession(createRequest("/auth/login"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/cursos");
  });
});
