import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiRequest } from "../client";

describe("apiRequest", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    vi.resetAllMocks();
  });

  it("deve adicionar header ngrok-skip-browser-warning", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response);

    await apiRequest("http://test.com");

    expect(mockFetch).toHaveBeenCalledWith(
      "http://test.com",
      expect.objectContaining({
        headers: expect.objectContaining({
          "ngrok-skip-browser-warning": "true",
        }),
      }),
    );
  });

  it("deve mesclar headers personalizados", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response);

    await apiRequest("http://test.com", {
      headers: { "Content-Type": "application/json" },
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "http://test.com",
      expect.objectContaining({
        headers: expect.objectContaining({
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        }),
      }),
    );
  });
});
