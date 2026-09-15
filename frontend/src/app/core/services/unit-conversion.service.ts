import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UnitConversionService {
  convertVelocity(value: number, from: string, to: string): number {
    const cmPerSecond = this.toCmPerSecond(value, from);

    switch (to) {
      case 'mm/s':
        return cmPerSecond * 10;

      case 'cm/s':
        return cmPerSecond;

      case 'm/s':
        return cmPerSecond / 100;

      case 'km/h':
        return cmPerSecond * 0.036;

      case 'ft/s':
        return cmPerSecond / 30.48;

      default:
        return value;
    }
  }

  private toCmPerSecond(value: number, unit: string): number {
    switch (unit) {
      case 'mm/s':
        return value / 10;

      case 'cm/s':
        return value;

      case 'm/s':
        return value * 100;

      case 'km/h':
        return value / 0.036;

      case 'ft/s':
        return value * 30.48;

      default:
        return value;
    }
  }

  convertPressure(value: number, from: string, to: string): number {
    const mbar = this.toMbar(value, from);

    switch (to) {
      case 'Pa':
        return mbar * 100;

      case 'kPa':
        return mbar / 10;

      case 'mbar':
        return mbar;

      case 'bar':
        return mbar / 1000;

      case 'psi':
        return mbar * 0.0145038;

      case 'atm':
        return mbar / 1013.25;

      default:
        return value;
    }
  }

  private toMbar(value: number, unit: string): number {
    switch (unit) {
      case 'Pa':
        return value / 100;

      case 'kPa':
        return value * 10;

      case 'mbar':
        return value;

      case 'bar':
        return value * 1000;

      case 'psi':
        return value / 0.0145038;

      case 'atm':
        return value * 1013.25;

      default:
        return value;
    }
  }

  convertTemperature(value: number, from: string, to: string): number {
    let celsius: number;

    switch (from) {
      case '°F':
        celsius = ((value - 32) * 5) / 9;
        break;

      case 'K':
        celsius = value - 273.15;
        break;

      default:
        celsius = value;
    }

    switch (to) {
      case '°F':
        return (celsius * 9) / 5 + 32;

      case 'K':
        return celsius + 273.15;

      default:
        return celsius;
    }
  }
}
