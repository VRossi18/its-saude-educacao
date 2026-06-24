import { describe, expect, it } from "vitest";

import { getEmbedUrl } from "@/lib/youtube";
import type { CursoVideo } from "@/lib/types/api";

const baseVideo: CursoVideo = {
  id: 1,
  titulo: "Aula 1",
  youtube_url: "",
  video_id: null,
  ordem: 1,
};

describe("getEmbedUrl", () => {
  it("usa video_id quando presente", () => {
    const url = getEmbedUrl({
      ...baseVideo,
      video_id: "abc123",
    });
    expect(url).toBe("https://www.youtube.com/embed/abc123");
  });

  it("extrai id de link youtu.be", () => {
    const url = getEmbedUrl({
      ...baseVideo,
      youtube_url: "https://youtu.be/xyz789",
    });
    expect(url).toBe("https://www.youtube.com/embed/xyz789");
  });

  it("extrai id de link watch?v=", () => {
    const url = getEmbedUrl({
      ...baseVideo,
      youtube_url: "https://www.youtube.com/watch?v=watch123",
    });
    expect(url).toBe("https://www.youtube.com/embed/watch123");
  });

  it("retorna null para url inválida", () => {
    const url = getEmbedUrl({
      ...baseVideo,
      youtube_url: "https://example.com/video",
    });
    expect(url).toBeNull();
  });
});
