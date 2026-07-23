import axios from "axios";
import type {
  TrustReport,
  HistoryRecord,
  AnalyticsSummary,
  ChartDataPoint,
  VerificationRequest,
} from "../types";
import {
  MOCK_TRUST_REPORTS,
  MOCK_HISTORY,
  MOCK_ANALYTICS,
  MOCK_CHART_DATA,
} from "./mockData";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("gotcha_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function delay(ms = 600) {
  return new Promise((r) => setTimeout(r, ms));
}

export const verificationApi = {
  async submit(_req: VerificationRequest): Promise<{ jobId: string }> {
    await delay(1200);
    return { jobId: `job-${Date.now()}` };
  },

  async getStatus(_jobId: string): Promise<{ status: string; progress: number }> {
    await delay(400);
    return { status: "running", progress: 65 };
  },
};

export const reportsApi = {
  async getAll(): Promise<TrustReport[]> {
    await delay();
    return MOCK_TRUST_REPORTS;
  },

  async getById(id: string): Promise<TrustReport> {
    await delay();
    const report = MOCK_TRUST_REPORTS.find((r) => r.id === id);
    if (!report) throw new Error(`Report ${id} not found`);
    return report;
  },
};

export const historyApi = {
  async getAll(): Promise<HistoryRecord[]> {
    await delay();
    return MOCK_HISTORY;
  },
};

export const analyticsApi = {
  async getSummary(): Promise<AnalyticsSummary> {
    await delay();
    return MOCK_ANALYTICS;
  },

  async getChartData(): Promise<ChartDataPoint[]> {
    await delay();
    return MOCK_CHART_DATA;
  },
};
