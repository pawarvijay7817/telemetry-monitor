import { Component, signal } from '@angular/core';
import { DashboardComponent } from './features/dashboard/dashboard';

@Component({
  selector: 'app-root',
  imports: [DashboardComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('frontend');
  readonly darkMode = signal(false);

  toggleTheme(): void {
    this.darkMode.update((value) => !value);
    document.body.classList.toggle('dark-theme', this.darkMode());
  }
}
