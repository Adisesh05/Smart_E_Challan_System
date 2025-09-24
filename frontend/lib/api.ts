// lib/api.ts
// Centralized API client for the e-Challan frontend (Next.js).
// - Reads backend base URL from NEXT_PUBLIC_API_BASE_URL (falls back to http://localhost:8000)
// - Handles JWT from localStorage
// - Sends multipart/form-data correctly for uploads
// - Throws typed ApiError on failures

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

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

    // Only set JSON header if body is NOT FormData
    const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

    const headers: Record<string, string> = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> | undefined),
    };
    if (!isFormData && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    const config: RequestInit = { ...options, headers };

    try {
      const res = await fetch(url, config);

      if (res.status === 401) {
        this.setAuthToken(null);
        if (typeof window !== "undefined") window.location.href = "/auth/login";
        throw new ApiError(401, "Unauthorized");
      }

      // Try to parse JSON; if not JSON, throw generic error with status text
      const text = await res.text();
      const maybeJson = (() => {
        try { return text ? JSON.parse(text) : {}; } catch { return { raw: text }; }
      })();

      if (!res.ok) {
        const msg =
          (maybeJson && (maybeJson.message || maybeJson.detail)) ||
          res.statusText ||
          "Request failed";
        throw new ApiError(res.status, msg);
      }

      // If the body was empty, return {} to keep call sites simple
      return (maybeJson as T) ?? ({} as T);
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(0, "Network error");
    }
  }

  // ---------- Auth ----------
  async register(email: string, password: string) {
    const data = await this.request<{ access_token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
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

  // ---------- Bootstrap (one-time after login) ----------
  async bootstrapViolationTypes() {
    return this.request<{ ok: boolean }>("/bootstrap/violation-types", {
      method: "POST",
    });
  }

  // ---------- Upload & Analyze ----------
  async analyzeVideo(location: string, file: File) {
    const fd = new FormData();
    fd.append("location", location);
    fd.append("video", file);

    return this.request<{
      vehicle: { plate: string; type: string };
      violation: { type: string; confidence: number; location: string };
      challan: { id: number; amount: number; status: string };
    }>("/process/analyze", {
      method: "POST",
      body: fd, // DO NOT set Content-Type; browser will set multipart boundary
    });
  }

  // ---------- List challans ----------
  async listChallans(plate?: string) {
    const query = plate ? `?plate=${encodeURIComponent(plate)}` : "";
    return this.request<
      Array<{
        id: number;
        plate: string;
        type: string;
        amount: number;
        status: string;
        issued_at: string;
      }>
    >(`/challans${query}`, { method: "GET" });
  }
}

export const api = new ApiClient();
export default api;
