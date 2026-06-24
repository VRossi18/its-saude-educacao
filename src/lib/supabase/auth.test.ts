import { describe, expect, it, vi, beforeEach } from "vitest";

const signInWithPassword = vi.fn();
const signUp = vi.fn();
const resetPasswordForEmail = vi.fn();

vi.mock("@/utils/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signInWithPassword,
      signUp,
      resetPasswordForEmail,
    },
  }),
}));

import { login, recoverPassword, signup } from "@/lib/supabase/auth";

describe("supabase auth service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("login chama signInWithPassword", async () => {
    signInWithPassword.mockResolvedValue({ error: null });

    await login({ email: "a@b.com", password: "senha1234" });

    expect(signInWithPassword).toHaveBeenCalledWith({
      email: "a@b.com",
      password: "senha1234",
    });
  });

  it("signup retorna sessão quando há token", async () => {
    signUp.mockResolvedValue({
      data: {
        user: {
          id: "user-1",
          email: "a@b.com",
          user_metadata: { nome: "Maria" },
        },
        session: {
          access_token: "token",
          refresh_token: "refresh",
          expires_in: 3600,
        },
      },
      error: null,
    });

    const session = await signup({
      nome: "Maria",
      email: "a@b.com",
      password: "senha1234",
    });

    expect(session.access_token).toBe("token");
    expect(session.user.nome).toBe("Maria");
  });

  it("signup retorna mensagem quando confirmação de e-mail é necessária", async () => {
    signUp.mockResolvedValue({
      data: {
        user: {
          id: "user-1",
          email: "a@b.com",
          user_metadata: { nome: "Maria" },
        },
        session: null,
      },
      error: null,
    });

    const session = await signup({
      nome: "Maria",
      email: "a@b.com",
      password: "senha1234",
    });

    expect(session.access_token).toBeUndefined();
    expect(session.message).toContain("Verifique seu e-mail");
  });

  it("recoverPassword dispara resetPasswordForEmail", async () => {
    resetPasswordForEmail.mockResolvedValue({ error: null });

    const response = await recoverPassword("a@b.com");

    expect(resetPasswordForEmail).toHaveBeenCalled();
    expect(response.message).toContain("Se o e-mail existir");
  });
});
