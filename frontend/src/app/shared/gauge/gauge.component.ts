import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { Status } from '../../core/models/telemetry.model';

@Component({
  selector: 'app-gauge',
  standalone: true,
  templateUrl: './gauge.component.html',
  styleUrl: './gauge.component.scss',
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GaugeComponent {
  readonly value = input.required<number>();
  readonly min = input(0);
  readonly max = input.required<number>();
  readonly unit = input.required<string>();
  readonly status = input.required<Status>();

  readonly valuePercent = computed(() => {
    const range = this.max() - this.min();
    if (range <= 0) {
      return 0;
    }

    return Math.min(100, Math.max(0, ((this.value() - this.min()) / range) * 100));
  });
}
