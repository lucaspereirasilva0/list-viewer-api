const API_CLIENT = {
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
};

export async function apiRequest(
  url: string,
  options?: RequestInit,
): Promise<Response> {
  return fetch(url, {
    ...options,
    headers: { ...API_CLIENT.headers, ...options?.headers },
  });
}
