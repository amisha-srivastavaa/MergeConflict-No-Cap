import axios from "axios";
import type {
  TrustReport,
  HistoryRecord,
  AnalyticsSummary,
  ChartDataPoint,
  VerificationRequest,
  BackendScanResponse,
  BackendHistoryItem,
  BackendAnalytics,
} from "../types";
import {
  backendItemToHistoryRecord,
  backendItemToTrustReport,
  backendAnalyticsToSummary,
} from "../types";
import {
  MOCK_CHART_DATA,
} from "./mockData";

const BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 60000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("gotcha_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const verificationApi = {
  async submit(req: VerificationRequest): Promise<BackendScanResponse> {
    const { data } = await apiClient.post<BackendScanResponse>("/scan/url", {
      url: req.url,
      targetType: req.targetType,
      deep: req.deep,
      includeDependencies: req.includeDependencies,
    });
    return data;
  },

  async getStatus(scanId: string): Promise<BackendHistoryItem> {
    const { data } = await apiClient.get<BackendHistoryItem>(`/scan/${scanId}`);
    return data;
  },
};

export const reportsApi = {
  async getAll(): Promise<TrustReport[]> {
    const { data } = await apiClient.get<BackendHistoryItem[]>("/scan/history");
    return data.map(backendItemToTrustReport);
  },

  async getById(id: string): Promise<TrustReport> {
    const { data } = await apiClient.get<BackendHistoryItem>(`/scan/${id}`);
    return backendItemToTrustReport(data);
  },
};

export const historyApi = {
  async getAll(): Promise<HistoryRecord[]> {
    const { data } = await apiClient.get<BackendHistoryItem[]>("/scan/history");
    return data.map(backendItemToHistoryRecord);
  },
};

export const analyticsApi = {
  async getSummary(): Promise<AnalyticsSummary> {
    const { data } = await apiClient.get<BackendAnalytics>("/scan/analytics");
    return backendAnalyticsToSummary(data);
  },

  async getChartData(): Promise<ChartDataPoint[]> {
    // Chart data is not yet available from backend — use mock for now
    return MOCK_CHART_DATA;
  },
};
