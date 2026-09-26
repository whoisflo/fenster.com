import { vi } from "vitest";

import { sampleApiProducts } from "@/__tests__/fixtures/apiProducts";

export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function mockFakeStoreApi({ failGet = false, failPost = false } = {}) {
  const fetchMock = vi.fn(
    async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      if (init?.method === "POST") {
        if (failPost) return jsonResponse({ message: "Server error" }, 500);
        return jsonResponse({ id: 21, ...JSON.parse(String(init.body)) }, 201);
      }

      if (failGet) return jsonResponse({ message: "Server error" }, 500);
      const limit = Number(new URL(String(input)).searchParams.get("limit"));
      return jsonResponse(sampleApiProducts().slice(0, limit));
    },
  );

  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}
