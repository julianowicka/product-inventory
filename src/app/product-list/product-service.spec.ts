import { TestBed } from '@angular/core/testing';
import { ProductService } from './product-service';
import { Product } from './product-model';
import { ErrorService } from '../error-handling/error.service';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        { provide: ErrorService, useValue: jasmine.createSpyObj('ErrorService', ['showError', 'showWarning', 'showSuccess']) }
      ]
    });
    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with empty products array', () => {
    const products = service.getProducts();
    expect(products).toEqual([]);
  });

  it('should add a product correctly', () => {
    const product = new Product();
    product.name = 'Test Product';
    product.description = 'Test Description';
    product.price = 10.99;
    product.quantity = 5;

    service.addProduct(product);

    const products = service.getProducts();
    expect(products.length).toBe(1);
    expect(products[0].name).toBe('Test Product');
    expect(products[0].id).toBe(1);
  });

  it('should assign incremental IDs to products', () => {
    const product1 = new Product();
    product1.name = 'Product 1';
    product1.price = 10.99;
    product1.quantity = 5;
    
    const product2 = new Product();
    product2.name = 'Product 2';
    product2.price = 20.99;
    product2.quantity = 10;

    service.addProduct(product1);
    service.addProduct(product2);

    const products = service.getProducts();
    expect(products[0].id).toBe(1);
    expect(products[1].id).toBe(2);
  });

  it('should delete a product by ID', () => {
    const product1 = new Product();
    product1.name = 'Product 1';
    product1.price = 10.99;
    product1.quantity = 5;
    
    const product2 = new Product();
    product2.name = 'Product 2';
    product2.price = 20.99;
    product2.quantity = 10;

    service.addProduct(product1);
    service.addProduct(product2);

    expect(service.getProducts().length).toBe(2);

    service.deleteProducts(1);

    const products = service.getProducts();
    expect(products.length).toBe(1);
    expect(products[0].name).toBe('Product 2');
  });

  it('should handle deleting non-existent product gracefully', () => {
    const product = new Product();
    product.name = 'Test Product';
    product.price = 10.99;
    product.quantity = 5;
    service.addProduct(product);

    expect(service.getProducts().length).toBe(1);

    service.deleteProducts(999); // Non-existent ID

    expect(service.getProducts().length).toBe(1);
  });

  it('should handle deleting with undefined ID gracefully', () => {
    const product = new Product();
    product.name = 'Test Product';
    product.price = 10.99;
    product.quantity = 5;
    service.addProduct(product);

    expect(service.getProducts().length).toBe(1);

    service.deleteProducts(undefined);

    expect(service.getProducts().length).toBe(1);
  });
});
