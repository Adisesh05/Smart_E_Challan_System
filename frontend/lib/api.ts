// lib/api.ts
export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

class ApiClient {
  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
  }
  private setAuthToken(token: string | null) {
    if (typeof window === "undefined") return;
    if (token) localStorage.setItem("auth_token", token);
    else localStorage.removeItem("auth_token");
  }

  private async request<T = any>(path: string, options: RequestInit = {}): Promise<T> {
    const token = this.getAuthToken();
    const url = `${API_BASE_URL}${path}`;
    const isFormData =
      typeof FormData !== "undefined" && options.body instanceof FormData;

    const headers: Record<string, string> = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> | undefined),
    };
    if (!isFormData && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(url, { ...options, headers });

    if (res.status === 401) {
      this.setAuthToken(null);
      if (typeof window !== "undefined") window.location.href = "/auth/login";
      throw new ApiError(401, "Unauthorized");
    }

    const text = await res.text();
    let body: any = {};
    try { body = text ? JSON.parse(text) : {}; } catch { body = { raw: text }; }

    if (!res.ok) {
      const msg = body?.message || body?.detail || res.statusText || "Request failed";
      throw new ApiError(res.status, msg);
    }
    return body as T;
  }

  // Auth
  async register(email: string, password: string, full_name?: string) {
    const data = await this.request<{ access_token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, full_name }),
    });
    this.setAuthToken(data.access_token);
    return data;
  }

  async login(email: string, password: string) {
    const data = await this.request<{ access_token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    this.setAuthToken(data.access_token);
    return data;
  }

  logout() {
    this.setAuthToken(null);
  }

  // Bootstrap
  bootstrapViolationTypes() {
    return this.request<{ ok: boolean }>("/bootstrap/violation-types", { method: "POST" });
  }

  // Upload
  analyzeVideo(location: string, file: File) {
    const fd = new FormData();
    fd.append("location", location);
    fd.append("video", file);
    return this.request<{
      vehicle: { plate: string; type: string };
      violation: { type: string; confidence: number; location: string };
      challan: { id: number; amount: number; status: string };
    }>("/process/analyze", { method: "POST", body: fd });
  }

  // Challans
  listChallans(plate?: string) {
    const q = plate ? `?plate=${encodeURIComponent(plate)}` : "";
    return this.request<Array<{
      id: number; plate: string; type: string; amount: number; status: string; issued_at: string;
    }>>(`/challans${q}`, { method: "GET" });
  }
}

export const api = new ApiClient();
export default api;
