import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from './product-service';
import { Product } from './product-model';
import { ErrorService } from '../error-handling/error.service';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let errorService: jasmine.SpyObj<ErrorService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ProductService', ['getProducts', 'deleteProducts']);
    const errorServiceSpy = jasmine.createSpyObj('ErrorService', ['showError', 'showWarning', 'showInfo']);
    
    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        { provide: ProductService, useValue: spy },
        { provide: ErrorService, useValue: errorServiceSpy }
      ]
    }).compileComponents();

    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    errorService = TestBed.inject(ErrorService) as jasmine.SpyObj<ErrorService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    
    // Mock confirm dialog
    spyOn(window, 'confirm').and.returnValue(true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    const mockProducts: Product[] = [
      { id: 1, name: 'Product 1', description: 'Description 1', price: 10, quantity: 5 },
      { id: 2, name: 'Product 2', description: 'Description 2', price: 20, quantity: 10 }
    ];
    
    productService.getProducts.and.returnValue(mockProducts);

    component.ngOnInit();

    expect(productService.getProducts).toHaveBeenCalled();
    expect(component.products.length).toBeGreaterThan(0);
  });

  it('should load products from service', () => {
    const mockProducts: Product[] = [
      { id: 1, name: 'Product 1', description: 'Description 1', price: 10, quantity: 5 },
      { id: 2, name: 'Product 2', description: 'Description 2', price: 20, quantity: 10 }
    ];
    
    productService.getProducts.and.returnValue(mockProducts);

    component.ngOnInit();

    expect(component.products).toEqual(mockProducts);
  });

  it('should handle empty products array from service', () => {
    productService.getProducts.and.returnValue([]);

    component.ngOnInit();

    expect(component.products).toEqual([]);
  });

  it('should call deleteProducts on service when deleteProducts is called', () => {
    const productId = 1;
    
    component.deleteProducts(productId);

    expect(productService.deleteProducts).toHaveBeenCalledWith(productId);
  });

  it('should handle keyboard events for delete button', () => {
    const mockEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    const mockButton = document.createElement('button');
    mockButton.setAttribute('data-product-id', '1');
    
    Object.defineProperty(mockEvent, 'target', {
      value: mockButton,
      writable: true
    });
    spyOn(mockEvent, 'preventDefault');
    spyOn(component, 'deleteProducts');

    component.handleKeyboardEvent(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(component.deleteProducts).toHaveBeenCalledWith(1);
  });

  it('should not handle keyboard events for non-button elements', () => {
    const mockEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    const mockDiv = document.createElement('div');
    
    Object.defineProperty(mockEvent, 'target', {
      value: mockDiv,
      writable: true
    });
    spyOn(component, 'deleteProducts');

    component.handleKeyboardEvent(mockEvent);

    expect(component.deleteProducts).not.toHaveBeenCalled();
  });

  it('should not handle non-Enter/Space keyboard events', () => {
    const mockEvent = new KeyboardEvent('keydown', { key: 'Tab' });
    const mockButton = document.createElement('button');
    
    Object.defineProperty(mockEvent, 'target', {
      value: mockButton,
      writable: true
    });
    spyOn(component, 'deleteProducts');

    component.handleKeyboardEvent(mockEvent);

    expect(component.deleteProducts).not.toHaveBeenCalled();
  });

  it('should display products in template', () => {
    const mockProducts: Product[] = [
      { id: 1, name: 'Test Product', description: 'Test Description', price: 10, quantity: 5 }
    ];
    
    // Mock service to return our test products
    productService.getProducts.and.returnValue(mockProducts);
    
    component.ngOnInit();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test Product');
    expect(compiled.textContent).toContain('Test Description');
  });

  it('should show empty state when no products', () => {
    // Mock service to return empty array
    productService.getProducts.and.returnValue([]);
    
    component.ngOnInit();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('No Products Found');
  });
});
