import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AddProductComponent } from './add-product.component';
import { ProductService } from '../product-list/product-service';
import { Product } from '../product-list/product-model';
import { ErrorService } from '../error-handling/error.service';

describe('AddProductComponent', () => {
  let component: AddProductComponent;
  let fixture: ComponentFixture<AddProductComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let router: jasmine.SpyObj<Router>;
  let errorService: jasmine.SpyObj<ErrorService>;

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['addProduct']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const errorServiceSpy = jasmine.createSpyObj('ErrorService', ['showError', 'showWarning', 'showSuccess']);

    await TestBed.configureTestingModule({
      declarations: [AddProductComponent],
      imports: [FormsModule],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ErrorService, useValue: errorServiceSpy }
      ]
    }).compileComponents();

    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    errorService = TestBed.inject(ErrorService) as jasmine.SpyObj<ErrorService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add product when form is submitted with valid data', () => {
    const mockForm = {
      value: {
        name: 'Test Product',
        description: 'Test Description',
        price: 10.99,
        quantity: 5
      },
      valid: true,
      resetForm: jasmine.createSpy('resetForm')
    };

    component.addProduct(mockForm as any);

    expect(productService.addProduct).toHaveBeenCalledWith(jasmine.any(Product));
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
    expect(mockForm.resetForm).toHaveBeenCalled();
    
    const addedProduct = productService.addProduct.calls.mostRecent().args[0];
    expect(addedProduct.name).toBe('Test Product');
    expect(addedProduct.description).toBe('Test Description');
    expect(addedProduct.price).toBe(10.99);
    expect(addedProduct.quantity).toBe(5);
  });

  it('should handle form submission with invalid form', () => {
    const mockForm = {
      value: {
        name: '',
        description: '',
        price: 0,
        quantity: 0
      },
      valid: false
    };

    component.addProduct(mockForm as any);

    expect(errorService.showWarning).toHaveBeenCalledWith('Please fill in all required fields correctly');
    expect(productService.addProduct).not.toHaveBeenCalled();
  });

  it('should create product with correct properties', () => {
    const mockForm = {
      value: {
        name: 'Sample Product',
        description: 'Sample Description',
        price: 25.50,
        quantity: 10
      },
      valid: true,
      resetForm: jasmine.createSpy('resetForm')
    };

    component.addProduct(mockForm as any);

    const addedProduct = productService.addProduct.calls.mostRecent().args[0];
    expect(addedProduct).toBeInstanceOf(Product);
    expect(addedProduct.name).toBe('Sample Product');
    expect(addedProduct.description).toBe('Sample Description');
    expect(addedProduct.price).toBe(25.50);
    expect(addedProduct.quantity).toBe(10);
  });

  it('should render form elements', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    expect(compiled.querySelector('form')).toBeTruthy();
    expect(compiled.querySelector('input[name="name"]')).toBeTruthy();
    expect(compiled.querySelector('input[name="description"]')).toBeTruthy();
    expect(compiled.querySelector('input[name="price"]')).toBeTruthy();
    expect(compiled.querySelector('select[name="quantity"]')).toBeTruthy();
    expect(compiled.querySelector('button[type="submit"]')).toBeTruthy();
  });

  it('should have proper form labels', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    expect(compiled.querySelector('label[for="name"]')).toBeTruthy();
    expect(compiled.querySelector('label[for="description"]')).toBeTruthy();
    expect(compiled.querySelector('label[for="price"]')).toBeTruthy();
    expect(compiled.querySelector('label[for="quantity"]')).toBeTruthy();
  });

  it('should have required attributes on mandatory fields', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    const nameInput = compiled.querySelector('input[name="name"]') as HTMLInputElement;
    const priceInput = compiled.querySelector('input[name="price"]') as HTMLInputElement;
    const quantitySelect = compiled.querySelector('select[name="quantity"]') as HTMLSelectElement;
    
    expect(nameInput.hasAttribute('required')).toBe(true);
    expect(priceInput.hasAttribute('required')).toBe(true);
    expect(quantitySelect.hasAttribute('required')).toBe(true);
  });

  it('should have proper input types', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    const nameInput = compiled.querySelector('input[name="name"]') as HTMLInputElement;
    const descriptionInput = compiled.querySelector('input[name="description"]') as HTMLInputElement;
    const priceInput = compiled.querySelector('input[name="price"]') as HTMLInputElement;
    
    expect(nameInput.type).toBe('text');
    expect(descriptionInput.type).toBe('text');
    expect(priceInput.type).toBe('number');
  });

  it('should have proper form accessibility attributes', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    const form = compiled.querySelector('form');
    expect(form?.getAttribute('role')).toBe('form');
    expect(form?.getAttribute('aria-label')).toBe('Add new product form');
  });
});
