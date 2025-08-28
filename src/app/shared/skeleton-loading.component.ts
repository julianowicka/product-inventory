import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-container" [class]="type">
      <div class="skeleton-item" *ngFor="let item of items; trackBy: trackByIndex"></div>
    </div>
  `,
  styles: [`
    .skeleton-container {
      width: 100%;
    }

    .skeleton-item {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .table-row .skeleton-item {
      height: 60px;
      margin-bottom: 0.25rem;
    }

    .card .skeleton-item {
      height: 120px;
      margin-bottom: 1rem;
    }

    .form .skeleton-item {
      height: 40px;
      margin-bottom: 1rem;
    }

    @keyframes loading {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
  `]
})
export class SkeletonLoadingComponent {
  @Input() type: 'table-row' | 'card' | 'form' = 'table-row';
  @Input() count: number = 5;

  get items(): number[] {
    return Array.from({ length: this.count }, (_, i) => i);
  }

  trackByIndex(index: number): number {
    return index;
  }
}
