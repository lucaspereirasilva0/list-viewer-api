import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiRequest } from "../client";

global.fetch = vi.fn();

describe("apiRequest", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("deve adicionar header ngrok-skip-browser-warning", async () => {
    const mockFetch = global.fetch as unknown as ReturnType<typeof vi.fn>;
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
      })
    );
  });

  it("deve mesclar headers personalizados", async () => {
    const mockFetch = global.fetch as unknown as ReturnType<typeof vi.fn>;
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
      })
    );
  });
});
