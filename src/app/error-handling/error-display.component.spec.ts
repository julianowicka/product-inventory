import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorDisplayComponent } from './error-display.component';
import { ErrorService, ErrorInfo } from './error.service';
import { BehaviorSubject } from 'rxjs';

describe('ErrorDisplayComponent', () => {
  let component: ErrorDisplayComponent;
  let fixture: ComponentFixture<ErrorDisplayComponent>;
  let errorService: jasmine.SpyObj<ErrorService>;
  let errorsSubject: BehaviorSubject<ErrorInfo[]>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ErrorService', ['removeError']);
    errorsSubject = new BehaviorSubject<ErrorInfo[]>([]);
    spy.errors$ = errorsSubject.asObservable();

    await TestBed.configureTestingModule({
      declarations: [ErrorDisplayComponent],
      providers: [
        { provide: ErrorService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorDisplayComponent);
    component = fixture.componentInstance;
    errorService = TestBed.inject(ErrorService) as jasmine.SpyObj<ErrorService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display errors when no errors exist', () => {
    errorsSubject.next([]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.error-container')).toBeFalsy();
  });

  it('should display error message when errors exist', () => {
    const testError: ErrorInfo = {
      id: '1',
      message: 'Test error message',
      type: 'error',
      timestamp: new Date(),
      dismissible: true
    };

    errorsSubject.next([testError]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test error message');
    expect(compiled.querySelector('.alert-danger')).toBeTruthy();
  });

  it('should display warning message with correct styling', () => {
    const testWarning: ErrorInfo = {
      id: '1',
      message: 'Test warning message',
      type: 'warning',
      timestamp: new Date(),
      dismissible: true
    };

    errorsSubject.next([testWarning]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test warning message');
    expect(compiled.querySelector('.alert-warning')).toBeTruthy();
  });

  it('should display info message with correct styling', () => {
    const testInfo: ErrorInfo = {
      id: '1',
      message: 'Test info message',
      type: 'info',
      timestamp: new Date(),
      dismissible: true
    };

    errorsSubject.next([testInfo]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test info message');
    expect(compiled.querySelector('.alert-info')).toBeTruthy();
  });

  it('should display multiple errors', () => {
    const errors: ErrorInfo[] = [
      {
        id: '1',
        message: 'First error',
        type: 'error',
        timestamp: new Date(),
        dismissible: true
      },
      {
        id: '2',
        message: 'Second error',
        type: 'warning',
        timestamp: new Date(),
        dismissible: true
      }
    ];

    errorsSubject.next(errors);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('First error');
    expect(compiled.textContent).toContain('Second error');
    expect(compiled.querySelectorAll('.alert').length).toBe(2);
  });

  it('should call removeError when dismiss button is clicked', () => {
    const testError: ErrorInfo = {
      id: '1',
      message: 'Test error message',
      type: 'error',
      timestamp: new Date(),
      dismissible: true
    };

    errorsSubject.next([testError]);
    fixture.detectChanges();

    const dismissButton = fixture.nativeElement.querySelector('.btn-close');
    dismissButton.click();

    expect(errorService.removeError).toHaveBeenCalledWith('1');
  });

  it('should not show dismiss button for non-dismissible errors', () => {
    const testError: ErrorInfo = {
      id: '1',
      message: 'Test error message',
      type: 'error',
      timestamp: new Date(),
      dismissible: false
    };

    errorsSubject.next([testError]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.btn-close')).toBeFalsy();
  });

  it('should display error details when provided', () => {
    const testError: ErrorInfo = {
      id: '1',
      message: 'Test error message',
      type: 'error',
      timestamp: new Date(),
      details: 'Additional error details',
      dismissible: true
    };

    errorsSubject.next([testError]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Additional error details');
  });

  it('should display action when provided', () => {
    const testError: ErrorInfo = {
      id: '1',
      message: 'Test error message',
      type: 'error',
      timestamp: new Date(),
      action: 'Error Action',
      dismissible: true
    };

    errorsSubject.next([testError]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Error Action:');
  });

  it('should display timestamp', () => {
    const testDate = new Date('2023-01-01T12:00:00');
    const testError: ErrorInfo = {
      id: '1',
      message: 'Test error message',
      type: 'error',
      timestamp: testDate,
      dismissible: true
    };

    errorsSubject.next([testError]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('1/1/23, 12:00 PM');
  });

  it('should set correct aria-live attribute for error type', () => {
    const testError: ErrorInfo = {
      id: '1',
      message: 'Test error message',
      type: 'error',
      timestamp: new Date(),
      dismissible: true
    };

    errorsSubject.next([testError]);
    fixture.detectChanges();

    const alertElement = fixture.nativeElement.querySelector('.alert');
    expect(alertElement.getAttribute('aria-live')).toBe('assertive');
  });

  it('should set correct aria-live attribute for info type', () => {
    const testError: ErrorInfo = {
      id: '1',
      message: 'Test info message',
      type: 'info',
      timestamp: new Date(),
      dismissible: true
    };

    errorsSubject.next([testError]);
    fixture.detectChanges();

    const alertElement = fixture.nativeElement.querySelector('.alert');
    expect(alertElement.getAttribute('aria-live')).toBe('polite');
  });

  it('should return correct alert class for different types', () => {
    expect(component.getAlertClass('error')).toBe('alert-danger');
    expect(component.getAlertClass('warning')).toBe('alert-warning');
    expect(component.getAlertClass('info')).toBe('alert-info');
    expect(component.getAlertClass('unknown')).toBe('alert-info');
  });

  it('should return correct icon class for different types', () => {
    expect(component.getIconClass('error')).toBe('fas fa-exclamation-circle');
    expect(component.getIconClass('warning')).toBe('fas fa-exclamation-triangle');
    expect(component.getIconClass('info')).toBe('fas fa-info-circle');
    expect(component.getIconClass('unknown')).toBe('fas fa-info-circle');
  });
});
