import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaugeComponent } from './gauge.component';

describe('GaugeComponent', () => {
  let component: GaugeComponent;
  let fixture: ComponentFixture<GaugeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GaugeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GaugeComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('value', 50);
    fixture.componentRef.setInput('min', 0);
    fixture.componentRef.setInput('max', 100);
    fixture.componentRef.setInput('unit', 'cm/s');
    fixture.componentRef.setInput('status', 'Normal');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('calculates the value percentage and renders meter attributes', () => {
    expect(component.valuePercent()).toBe(50);

    const meter = fixture.nativeElement.querySelector('[role="meter"]') as HTMLElement;
    expect(meter.getAttribute('aria-valuenow')).toBe('50');
    expect(meter.getAttribute('aria-valuemin')).toBe('0');
    expect(meter.getAttribute('aria-valuemax')).toBe('100');
    expect(meter.getAttribute('aria-label')).toBe('Normal gauge');
  });

  it('clamps values outside the configured range', () => {
    fixture.componentRef.setInput('value', 150);
    fixture.detectChanges();
    expect(component.valuePercent()).toBe(100);

    fixture.componentRef.setInput('value', -20);
    fixture.detectChanges();
    expect(component.valuePercent()).toBe(0);
  });

  it('returns zero for an invalid range', () => {
    fixture.componentRef.setInput('min', 100);
    fixture.componentRef.setInput('max', 100);
    fixture.detectChanges();

    expect(component.valuePercent()).toBe(0);
  });
});
