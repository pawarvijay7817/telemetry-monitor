import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import { DashboardResponse } from '../models/telemetry.model';
import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpTesting: HttpTestingController;

  const response: DashboardResponse = {
    timestamp: '2026-09-22T10:00:00.000Z',
    velocity: { value: 185.4, unit: 'cm/s', history: [] },
    pressure: { value: 1012, unit: 'mbar', history: [] },
    temperature: { value: 36.8, unit: '°C', history: [] },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(DashboardService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('gets the dashboard from the API', () => {
    let actual: DashboardResponse | undefined;

    service.getDashboard().subscribe((data) => {
      actual = data;
    });

    const request = httpTesting.expectOne(`${environment.apiUrl}/dashboard`);
    expect(request.request.method).toBe('GET');
    request.flush(response);

    expect(actual).toEqual(response);
  });
});
