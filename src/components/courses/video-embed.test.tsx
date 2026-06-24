import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { VideoEmbed } from "@/components/courses/video-embed";
import type { CursoVideo } from "@/lib/types/api";

const baseVideo: CursoVideo = {
  id: 1,
  titulo: "Introdução",
  youtube_url: "",
  video_id: null,
  ordem: 1,
};

describe("VideoEmbed", () => {
  it("renderiza iframe quando há video_id", () => {
    render(
      <VideoEmbed
        video={{
          ...baseVideo,
          video_id: "abc123",
        }}
      />,
    );

    const iframe = screen.getByTitle("Introdução");
    expect(iframe).toHaveAttribute(
      "src",
      "https://www.youtube.com/embed/abc123",
    );
  });

  it("mostra fallback quando não há url válida", () => {
    render(
      <VideoEmbed
        video={{
          ...baseVideo,
          youtube_url: "https://example.com/invalid",
        }}
      />,
    );

    expect(
      screen.getByText(/Não foi possível carregar o vídeo/i),
    ).toBeInTheDocument();
  });
});
