import { UnitConversionService } from './unit-conversion.service';

describe('UnitConversionService', () => {
  const service = new UnitConversionService();

  it('converts velocity values between supported units', () => {
    expect(service.convertVelocity(100, 'cm/s', 'mm/s')).toBe(1000);
    expect(service.convertVelocity(100, 'cm/s', 'm/s')).toBe(1);
    expect(service.convertVelocity(100, 'cm/s', 'km/h')).toBe(3.6);
    expect(service.convertVelocity(100, 'cm/s', 'ft/s')).toBeCloseTo(3.28084, 4);
  });

  it('converts pressure values between supported units', () => {
    expect(service.convertPressure(1000, 'mbar', 'Pa')).toBe(100000);
    expect(service.convertPressure(1000, 'mbar', 'kPa')).toBe(100);
    expect(service.convertPressure(1, 'bar', 'mbar')).toBe(1000);
    expect(service.convertPressure(1, 'atm', 'mbar')).toBe(1013.25);
  });

  it('converts temperatures through Celsius', () => {
    expect(service.convertTemperature(0, '°C', '°F')).toBe(32);
    expect(service.convertTemperature(32, '°F', '°C')).toBe(0);
    expect(service.convertTemperature(0, '°C', 'K')).toBe(273.15);
    expect(service.convertTemperature(273.15, 'K', '°C')).toBe(0);
  });

  it('returns the input for unknown units', () => {
    expect(service.convertVelocity(12, 'unknown', 'unknown')).toBe(12);
    expect(service.convertPressure(12, 'unknown', 'unknown')).toBe(12);
  });
});
