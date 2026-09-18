import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DashboardComponent } from './features/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  imports: [DashboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected readonly title = signal('frontend');
  readonly darkMode = signal(false);

  toggleTheme(): void {
    this.darkMode.update((value) => !value);
    document.body.classList.toggle('dark-theme', this.darkMode());
  }
}
