import { API_BASE_URL, API_TIMEOUT_MS } from "@/config";

export interface ApiProduct {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

export interface NewProduct {
  title: string;
  price: number;
}

export interface CreatedProduct extends NewProduct {
  id: number;
}

export class ApiError extends Error {
  readonly status: number | undefined;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isApiProduct(value: unknown): value is ApiProduct {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.title === "string" &&
    typeof value.price === "number" &&
    typeof value.category === "string" &&
    typeof value.image === "string" &&
    isRecord(value.rating) &&
    typeof value.rating.rate === "number" &&
    typeof value.rating.count === "number"
  );
}

function isCreatedProduct(value: unknown): value is CreatedProduct {
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
    throw new ApiError(
      `The API answered with status ${response.status}`,
      response.status,
    );
  }

  try {
    return await response.json();
  } catch {
    throw new ApiError("The API answered with invalid JSON", response.status);
  }
}

export async function fetchProducts(limit: number): Promise<ApiProduct[]> {
  const data = await request(`/products?limit=${limit}`);
  if (!Array.isArray(data) || !data.every(isApiProduct)) {
    throw new ApiError("The API answered with an unexpected product list");
  }
  return data;
}

export async function createProduct(
  product: NewProduct,
): Promise<CreatedProduct> {
  const data = await request("/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!isCreatedProduct(data)) {
    throw new ApiError("The API answered with an unexpected product");
  }
  return data;
}
