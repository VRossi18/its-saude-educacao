import { describe, expect, it } from "vitest";

import { sortVideos } from "@/lib/cursos-utils";
import type { CursoVideo } from "@/lib/types/api";

describe("sortVideos", () => {
  it("ordena vídeos por ordem ascendente", () => {
    const videos: CursoVideo[] = [
      {
        id: 1,
        titulo: "Aula 3",
        youtube_url: "",
        video_id: null,
        ordem: 3,
      },
      {
        id: 2,
        titulo: "Aula 1",
        youtube_url: "",
        video_id: null,
        ordem: 1,
      },
      {
        id: 3,
        titulo: "Aula 2",
        youtube_url: "",
        video_id: null,
        ordem: 2,
      },
    ];

    const sorted = sortVideos(videos);
    expect(sorted.map((video) => video.ordem)).toEqual([1, 2, 3]);
  });

  it("não muta o array original", () => {
    const videos: CursoVideo[] = [
      {
        id: 1,
        titulo: "B",
        youtube_url: "",
        video_id: null,
        ordem: 2,
      },
      {
        id: 2,
        titulo: "A",
        youtube_url: "",
        video_id: null,
        ordem: 1,
      },
    ];

    sortVideos(videos);
    expect(videos[0].ordem).toBe(2);
  });
});
