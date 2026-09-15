export interface TelemetrySample {
  time: string;
  timestamp: string;
  value: number;
}

export interface TelemetryParameter {
  value: number;
  unit: string;
  history: TelemetrySample[];
}

export interface DashboardResponse {
  timestamp: string;
  velocity: TelemetryParameter;
  pressure: TelemetryParameter;
  temperature: TelemetryParameter;
}
