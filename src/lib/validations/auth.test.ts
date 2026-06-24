import { describe, expect, it } from "vitest";

import {
  loginSchema,
  recoverPasswordSchema,
  resetPasswordSchema,
  signupSchema,
} from "@/lib/validations/auth";

describe("loginSchema", () => {
  it("aceita credenciais válidas", () => {
    const result = loginSchema.safeParse({
      email: "aluno@exemplo.com",
      password: "senha1234",
    });
    expect(result.success).toBe(true);
  });

  it("rejeita e-mail inválido", () => {
    const result = loginSchema.safeParse({
      email: "invalido",
      password: "senha1234",
    });
    expect(result.success).toBe(false);
  });

  it("rejeita senha curta", () => {
    const result = loginSchema.safeParse({
      email: "aluno@exemplo.com",
      password: "123",
    });
    expect(result.success).toBe(false);
  });
});

describe("signupSchema", () => {
  it("aceita cadastro válido", () => {
    const result = signupSchema.safeParse({
      nome: "Maria Silva",
      email: "maria@exemplo.com",
      password: "senha1234",
    });
    expect(result.success).toBe(true);
  });

  it("rejeita nome vazio", () => {
    const result = signupSchema.safeParse({
      nome: "",
      email: "maria@exemplo.com",
      password: "senha1234",
    });
    expect(result.success).toBe(false);
  });
});

describe("recoverPasswordSchema", () => {
  it("aceita e-mail válido", () => {
    const result = recoverPasswordSchema.safeParse({
      email: "aluno@exemplo.com",
    });
    expect(result.success).toBe(true);
  });
});

describe("resetPasswordSchema", () => {
  it("rejeita senha com menos de 8 caracteres", () => {
    const result = resetPasswordSchema.safeParse({ password: "abc" });
    expect(result.success).toBe(false);
  });
});
