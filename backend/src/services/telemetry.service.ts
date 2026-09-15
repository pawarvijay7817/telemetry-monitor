import {
  DashboardResponse,
  TelemetryParameter,
  TelemetrySample,
} from "../models/telemetry.model";

interface ParameterState {
  value: number;
  baseline: number;
  unit: string;
  history: TelemetrySample[];
}

class TelemetryService {
  private readonly MAX_SAMPLES = 100;

  private cycle = 0;

  private readonly state: {
    velocity: ParameterState;
    pressure: ParameterState;
    temperature: ParameterState;
  } = {
    velocity: {
      value: 185.4,
      baseline: 185.4,
      unit: "cm/s",
      history: [],
    },

    pressure: {
      value: 1012,
      baseline: 1012,
      unit: "mbar",
      history: [],
    },

    temperature: {
      value: 36.8,
      baseline: 36.8,
      unit: "°C",
      history: [],
    },
  };

  constructor() {
    this.initializeHistory();

    const simulationTimer = setInterval(() => this.update(), 1000);
    simulationTimer.unref();
  }

  private initializeHistory(): void {
    for (let i = 0; i < this.MAX_SAMPLES; i++) {
      this.updateParameter(this.state.velocity);
      this.updateParameter(this.state.pressure);
      this.updateParameter(this.state.temperature);
    }
  }

  update(): void {
    this.cycle++;

    this.updateParameter(this.state.velocity);
    this.updateParameter(this.state.pressure);
    this.updateParameter(this.state.temperature);
  }

  private updateParameter(parameter: ParameterState): void {
    const shouldRecover = this.cycle > 0 && this.cycle % 5 === 0;

    if (shouldRecover) {
      // Gradually move toward baseline.
      parameter.value += (parameter.baseline - parameter.value) * 0.25;
    } else {
      // Random movement approximately ±10%.
      const percentage = (Math.random() * 20 - 10) / 100;

      parameter.value = parameter.value * (1 + percentage);
    }

    const now = new Date();

    parameter.history.push({
      time: now.toLocaleTimeString("en-GB"),
      timestamp: now.toISOString(),
      value: Number(parameter.value.toFixed(2)),
    });

    if (parameter.history.length > this.MAX_SAMPLES) {
      parameter.history.shift();
    }
  }

  getDashboard(): DashboardResponse {
    return {
      timestamp: new Date().toISOString(),

      velocity: this.toResponse(this.state.velocity),

      pressure: this.toResponse(this.state.pressure),

      temperature: this.toResponse(this.state.temperature),
    };
  }

  private toResponse(parameter: ParameterState): TelemetryParameter {
    return {
      value: Number(parameter.value.toFixed(2)),
      unit: parameter.unit,
      history: [...parameter.history],
    };
  }
}

export const telemetryService = new TelemetryService();
