import { describe, expect, it } from "vitest";

import { parseApiError } from "@/lib/errors";

describe("parseApiError", () => {
  it("retorna message de Error", () => {
    expect(parseApiError(new Error("Falha no login"))).toBe("Falha no login");
  });

  it("retorna message de objeto com message string", () => {
    expect(parseApiError({ message: "E-mail inválido" })).toBe("E-mail inválido");
  });

  it("retorna fallback para valores desconhecidos", () => {
    expect(parseApiError(null)).toBe(
      "Ocorreu um erro inesperado. Tente novamente.",
    );
  });
});
