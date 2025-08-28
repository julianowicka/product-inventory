import { TestBed } from '@angular/core/testing';
import { ErrorService, ErrorInfo } from './error.service';

describe('ErrorService', () => {
  let service: ErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorService]
    });
    service = TestBed.inject(ErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with empty errors array', () => {
    expect(service.getErrors()).toEqual([]);
    expect(service.hasErrors()).toBe(false);
  });

  it('should add error correctly', () => {
    const errorId = service.addError('Test error message');
    
    const errors = service.getErrors();
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe('Test error message');
    expect(errors[0].type).toBe('error');
    expect(errors[0].id).toBe(errorId);
    expect(errors[0].dismissible).toBe(true);
    expect(service.hasErrors()).toBe(true);
  });

  it('should add error with custom type', () => {
    const errorId = service.addError('Test warning', 'warning', 'Additional details');
    
    const errors = service.getErrors();
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe('Test warning');
    expect(errors[0].type).toBe('warning');
    expect(errors[0].details).toBe('Additional details');
    expect(errors[0].id).toBe(errorId);
  });

  it('should add error with action', () => {
    const errorId = service.addError('Test info', 'info', 'Details', 'Action');
    
    const errors = service.getErrors();
    expect(errors.length).toBe(1);
    expect(errors[0].action).toBe('Action');
    expect(errors[0].id).toBe(errorId);
  });

  it('should remove error by id', () => {
    const errorId1 = service.addError('Error 1');
    const errorId2 = service.addError('Error 2');
    
    expect(service.getErrors().length).toBe(2);
    
    service.removeError(errorId1);
    
    const errors = service.getErrors();
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe('Error 2');
  });

  it('should clear all errors', () => {
    service.addError('Error 1');
    service.addError('Error 2');
    
    expect(service.getErrors().length).toBe(2);
    
    service.clearAllErrors();
    
    expect(service.getErrors()).toEqual([]);
    expect(service.hasErrors()).toBe(false);
  });

  it('should generate unique ids', () => {
    const id1 = service.addError('Error 1');
    const id2 = service.addError('Error 2');
    
    expect(id1).not.toBe(id2);
  });

  describe('Convenience methods', () => {
    it('should show error with showError method', () => {
      const errorId = service.showError('Critical error', 'Stack trace');
      
      const errors = service.getErrors();
      expect(errors[0].type).toBe('error');
      expect(errors[0].message).toBe('Critical error');
      expect(errors[0].details).toBe('Stack trace');
    });

    it('should show warning with showWarning method', () => {
      const errorId = service.showWarning('Warning message', 'Warning details');
      
      const errors = service.getErrors();
      expect(errors[0].type).toBe('warning');
      expect(errors[0].message).toBe('Warning message');
      expect(errors[0].details).toBe('Warning details');
    });

    it('should show info with showInfo method', () => {
      const errorId = service.showInfo('Info message', 'Info details');
      
      const errors = service.getErrors();
      expect(errors[0].type).toBe('info');
      expect(errors[0].message).toBe('Info message');
      expect(errors[0].details).toBe('Info details');
    });

    it('should show success with showSuccess method', () => {
      const errorId = service.showSuccess('Success message', 'Success details');
      
      const errors = service.getErrors();
      expect(errors[0].type).toBe('info');
      expect(errors[0].message).toBe('Success message');
      expect(errors[0].details).toBe('Success details');
      expect(errors[0].action).toBe('Success');
    });
  });

  describe('Observable behavior', () => {
    it('should emit errors through observable', (done) => {
      service.errors$.subscribe(errors => {
        expect(errors.length).toBe(1);
        expect(errors[0].message).toBe('Test observable');
        done();
      });

      service.addError('Test observable');
    });

    it('should emit updated errors when removing', (done) => {
      let callCount = 0;
      
      service.errors$.subscribe(errors => {
        callCount++;
        
        if (callCount === 1) {
          expect(errors.length).toBe(1);
          service.removeError(errors[0].id);
        } else if (callCount === 2) {
          expect(errors.length).toBe(0);
          done();
        }
      });

      service.addError('Test error');
    });
  });
});
