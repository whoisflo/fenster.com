import { API_BASE_URL, API_TIMEOUT_MS } from "@/config";

export interface NewProduct {
  title: string;
  price: number;
}

export interface ApiProduct extends NewProduct {
  id: number;
}

export class ApiError extends Error {
  name = "ApiError";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isApiProduct(value: unknown): value is ApiProduct {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.title === "string" &&
    typeof value.price === "number"
  );
}

async function request(path: string, init: RequestInit = {}): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });
  } catch {
    throw new ApiError("The request could not be completed");
  }

  if (!response.ok) {
    throw new ApiError(`The API answered with status ${response.status}`);
  }

  try {
    return await response.json();
  } catch {
    throw new ApiError("The API answered with invalid JSON");
  }
}

export async function fetchProducts(limit: number): Promise<ApiProduct[]> {
  const data = await request(`/products?limit=${limit}`);
  if (!Array.isArray(data) || !data.every(isApiProduct)) {
    throw new ApiError("The API answered with an unexpected product list");
  }
  return data;
}

export async function createProduct(product: NewProduct): Promise<ApiProduct> {
  const data = await request("/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!isApiProduct(data)) {
    throw new ApiError("The API answered with an unexpected product");
  }
  return data;
}
