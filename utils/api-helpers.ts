import { APIRequestContext, expect } from '@playwright/test';

export interface ApiResponse {
  status: number;
  body: Record<string, unknown>;
  headers: Record<string, string>;
}

export class ApiHelper {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async get(path: string, params?: Record<string, string>): Promise<ApiResponse> {
    const response = await this.request.get(path, { params });
    return {
      status: response.status(),
      body: await response.json().catch(() => ({})),
      headers: response.headers(),
    };
  }

  async post(path: string, data: Record<string, unknown>): Promise<ApiResponse> {
    const response = await this.request.post(path, { data });
    return {
      status: response.status(),
      body: await response.json().catch(() => ({})),
      headers: response.headers(),
    };
  }

  async put(path: string, data: Record<string, unknown>): Promise<ApiResponse> {
    const response = await this.request.put(path, { data });
    return {
      status: response.status(),
      body: await response.json().catch(() => ({})),
      headers: response.headers(),
    };
  }

  async delete(path: string): Promise<ApiResponse> {
    const response = await this.request.delete(path);
    return {
      status: response.status(),
      body: await response.json().catch(() => ({})),
      headers: response.headers(),
    };
  }

  assertStatus(response: ApiResponse, expected: number): void {
    expect(response.status).toBe(expected);
  }

  assertBodyContains(response: ApiResponse, key: string): void {
    expect(response.body).toHaveProperty(key);
  }

  assertResponseTime(startTime: number, maxMs: number): void {
    const elapsed = Date.now() - startTime;
    expect(elapsed).toBeLessThan(maxMs);
  }
}
