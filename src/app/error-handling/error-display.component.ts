import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ErrorService, ErrorInfo } from './error.service';

@Component({
  selector: 'app-error-display',
  template: `
    <div class="error-container" *ngIf="errors.length > 0">
      <div 
        *ngFor="let error of errors" 
        class="alert alert-dismissible fade show"
        [class]="getAlertClass(error.type)"
        role="alert"
        [attr.aria-live]="error.type === 'error' ? 'assertive' : 'polite'"
      >
        <div class="d-flex align-items-start">
          <div class="flex-grow-1">
            <div class="d-flex align-items-center mb-1">
              <i [class]="getIconClass(error.type)" class="me-2"></i>
              <strong *ngIf="error.action">{{ error.action }}:</strong>
              <span class="ms-1">{{ error.message }}</span>
            </div>
            <div *ngIf="error.details" class="error-details small text-muted">
              {{ error.details }}
            </div>
            <div class="error-timestamp small text-muted mt-1">
              {{ error.timestamp | date:'short' }}
            </div>
          </div>
          <button 
            *ngIf="error.dismissible"
            type="button" 
            class="btn-close ms-2" 
            (click)="dismissError(error.id)"
            aria-label="Dismiss error"
          ></button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .error-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1050;
      max-width: 400px;
      width: 100%;
    }

    .alert {
      margin-bottom: 10px;
      border: none;
      border-radius: 0.75rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      animation: slideInRight 0.3s ease-out;
    }

    .alert-success {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
    }

    .alert-danger {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
    }

    .alert-warning {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white;
    }

    .alert-info {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
    }

    .error-details {
      opacity: 0.9;
      font-style: italic;
    }

    .error-timestamp {
      opacity: 0.8;
    }

    .btn-close {
      filter: invert(1);
      opacity: 0.8;
    }

    .btn-close:hover {
      opacity: 1;
    }

    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @media (max-width: 768px) {
      .error-container {
        top: 10px;
        right: 10px;
        left: 10px;
        max-width: none;
      }
    }
  `]
})
export class ErrorDisplayComponent implements OnInit, OnDestroy {
  errors: ErrorInfo[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private errorService: ErrorService) {}

  ngOnInit(): void {
    this.subscription = this.errorService.errors$.subscribe(errors => {
      this.errors = errors;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  dismissError(errorId: string): void {
    this.errorService.removeError(errorId);
  }

  getAlertClass(type: string): string {
    switch (type) {
      case 'error': return 'alert-danger';
      case 'warning': return 'alert-warning';
      case 'info': return 'alert-info';
      default: return 'alert-info';
    }
  }

  getIconClass(type: string): string {
    switch (type) {
      case 'error': return 'fas fa-exclamation-circle';
      case 'warning': return 'fas fa-exclamation-triangle';
      case 'info': return 'fas fa-info-circle';
      default: return 'fas fa-info-circle';
    }
  }
}
