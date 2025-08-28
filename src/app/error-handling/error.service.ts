import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ErrorInfo {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  timestamp: Date;
  details?: string;
  action?: string;
  dismissible?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private errorsSubject = new BehaviorSubject<ErrorInfo[]>([]);
  public errors$ = this.errorsSubject.asObservable();

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  addError(message: string, type: 'error' | 'warning' | 'info' = 'error', details?: string, action?: string): string {
    const error: ErrorInfo = {
      id: this.generateId(),
      message,
      type,
      timestamp: new Date(),
      details,
      action,
      dismissible: true
    };

    const currentErrors = this.errorsSubject.value;
    this.errorsSubject.next([...currentErrors, error]);

    // Auto-dismiss info messages after 5 seconds
    if (type === 'info') {
      setTimeout(() => this.removeError(error.id), 5000);
    }

    return error.id;
  }

  removeError(errorId: string): void {
    const currentErrors = this.errorsSubject.value;
    const filteredErrors = currentErrors.filter(error => error.id !== errorId);
    this.errorsSubject.next(filteredErrors);
  }

  clearAllErrors(): void {
    this.errorsSubject.next([]);
  }

  getErrors(): ErrorInfo[] {
    return this.errorsSubject.value;
  }

  hasErrors(): boolean {
    return this.errorsSubject.value.length > 0;
  }

  // Convenience methods
  showError(message: string, details?: string): string {
    return this.addError(message, 'error', details);
  }

  showWarning(message: string, details?: string): string {
    return this.addError(message, 'warning', details);
  }

  showInfo(message: string, details?: string): string {
    return this.addError(message, 'info', details);
  }

  showSuccess(message: string, details?: string): string {
    return this.addError(message, 'info', details, 'Success');
  }
}
