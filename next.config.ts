import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Caminho absoluto do projeto — evita resolver módulos no diretório pai
    // (onde existe um pnpm-lock.yaml sem as dependências deste app).
    root: path.resolve(process.cwd()),
  },
};

export default nextConfig;
