import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, finalize, switchMap, timer } from 'rxjs';
import { NgxEchartsDirective } from 'ngx-echarts';

import { DashboardService } from '../../core/services/dashboard.service';
import { UnitConversionService } from '../../core/services/unit-conversion.service';

import {
  DashboardResponse,
  ParameterType,
  Status,
  TelemetrySample,
} from '../../core/models/telemetry.model';
import { ExportService } from '../../core/services/export.service';
import { GaugeComponent } from '../../shared/gauge/gauge';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe, DecimalPipe, NgxEchartsDirective, GaugeComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent {
  private readonly dashboardService = inject(DashboardService);
  private readonly conversionService = inject(UnitConversionService);
  private readonly exportService = inject(ExportService);
  private readonly destroyRef = inject(DestroyRef);

  readonly dashboard = signal<DashboardResponse | null>(null);

  readonly loading = signal(true);
  readonly connected = signal(false);
  readonly error = signal<string | null>(null);
  readonly lastUpdated = signal<Date | null>(null);

  readonly velocityUnit = signal('cm/s');
  readonly pressureUnit = signal('mbar');
  readonly temperatureUnit = signal('°C');

  readonly velocityUnits = ['mm/s', 'cm/s', 'm/s', 'km/h', 'ft/s'];
  readonly pressureUnits = ['Pa', 'kPa', 'mbar', 'bar', 'psi', 'atm'];
  readonly temperatureUnits = ['°C', '°F', 'K'];

  readonly collectedData = signal<DashboardResponse[]>([]);

  constructor() {
    this.startPolling();
  }

  private startPolling(): void {
    timer(0, 1000)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() =>
          this.dashboardService.getDashboard().pipe(
            catchError((error) => {
              console.error(error);

              this.connected.set(false);

              this.error.set('Unable to connect to telemetry server');

              return EMPTY;
            }),

            finalize(() => {
              this.loading.set(false);
            }),
          ),
        ),
      )
      .subscribe((data) => {
        this.dashboard.set(data);

        this.connected.set(true);

        this.error.set(null);

        this.lastUpdated.set(new Date());
        this.collectedData.update((history) => [...history.slice(-99), data]);
      });
  }

  changeUnit(type: ParameterType, unit: string): void {
    switch (type) {
      case 'velocity':
        this.velocityUnit.set(unit);
        break;

      case 'pressure':
        this.pressureUnit.set(unit);
        break;

      case 'temperature':
        this.temperatureUnit.set(unit);
        break;
    }
  }

  getCurrentValue(type: ParameterType): number {
    const data = this.dashboard();

    if (!data) {
      return 0;
    }

    switch (type) {
      case 'velocity':
        return this.conversionService.convertVelocity(
          data.velocity.value,
          data.velocity.unit,
          this.velocityUnit(),
        );

      case 'pressure':
        return this.conversionService.convertPressure(
          data.pressure.value,
          data.pressure.unit,
          this.pressureUnit(),
        );

      case 'temperature':
        return this.conversionService.convertTemperature(
          data.temperature.value,
          data.temperature.unit,
          this.temperatureUnit(),
        );
    }
  }

  getHistory(type: ParameterType): TelemetrySample[] {
    const parameter = this.dashboard()?.[type];
    if (!parameter) {
      return [];
    }

    const unit = this.getUnit(type);
    return parameter.history.map((sample) => ({
      ...sample,
      value: this.convertValue(type, sample.value, parameter.unit, unit),
    }));
  }

  getChartOptions(history: TelemetrySample[], unit: string): any {
    return {
      animation: true,
      animationDuration: 300,

      tooltip: {
        trigger: 'axis',
        valueFormatter: (value: number) => `${value.toFixed(2)} ${unit}`,
      },

      xAxis: {
        type: 'category',
        data: history.map((x) => x.time),
      },
      yAxis: {
        type: 'value',
      },

      dataZoom: [
        {
          type: 'inside',
        },
        {
          type: 'slider',
        },
      ],

      series: [
        {
          type: 'line',
          smooth: true,
          data: history.map((x) => x.value),
        },
      ],
    };
  }

  getUnit(type: ParameterType): string {
    return type === 'velocity'
      ? this.velocityUnit()
      : type === 'pressure'
        ? this.pressureUnit()
        : this.temperatureUnit();
  }

  getGaugeMax(type: ParameterType): number {
    const max = type === 'velocity' ? 400 : type === 'pressure' ? 1200 : 60;
    const unit = type === 'velocity' ? 'cm/s' : type === 'pressure' ? 'mbar' : '°C';
    return this.convertValue(type, max, unit, this.getUnit(type));
  }

  getStatus(type: ParameterType, value: number, unit: string): Status {
    const normalized = this.convertValue(
      type,
      value,
      unit,
      type === 'velocity' ? 'cm/s' : type === 'pressure' ? 'mbar' : '°C',
    );

    switch (type) {
      case 'velocity':
        if (normalized < 250) return 'Normal';
        if (normalized < 300) return 'Warning';

        return 'Critical';

      case 'pressure':
        if (normalized >= 950 && normalized <= 1050) {
          return 'Normal';
        }

        if (normalized >= 900 && normalized <= 1100) {
          return 'Warning';
        }

        return 'Critical';

      case 'temperature':
        if (normalized >= 20 && normalized <= 40) {
          return 'Normal';
        }

        if (normalized >= 10 && normalized <= 50) {
          return 'Warning';
        }

        return 'Critical';
    }
  }

  exportExcel(): void {
    this.exportService.exportExcel(this.toExportRows());
  }

  exportCsv(): void {
    this.exportService.exportCsv(this.toExportRows());
  }

  private toExportRows(): Record<string, string | number>[] {
    return this.collectedData().map((data) => ({
      Timestamp: data.timestamp,
      Velocity: data.velocity.value,
      'Velocity Unit': data.velocity.unit,
      Pressure: data.pressure.value,
      'Pressure Unit': data.pressure.unit,
      Temperature: data.temperature.value,
      'Temperature Unit': data.temperature.unit,
    }));
  }

  private convertValue(type: ParameterType, value: number, from: string, to: string): number {
    switch (type) {
      case 'velocity':
        return this.conversionService.convertVelocity(value, from, to);
      case 'pressure':
        return this.conversionService.convertPressure(value, from, to);
      case 'temperature':
        return this.conversionService.convertTemperature(value, from, to);
    }
  }
}
