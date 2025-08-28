import { Product } from './product-model';

describe('Product', () => {
  it('should create an instance', () => {
    const product = new Product();
    expect(product).toBeTruthy();
  });

  it('should have optional properties', () => {
    const product = new Product();
    
    expect(product.id).toBeUndefined();
    expect(product.name).toBeUndefined();
    expect(product.description).toBeUndefined();
    expect(product.price).toBeUndefined();
    expect(product.quantity).toBeUndefined();
  });

  it('should allow setting properties', () => {
    const product = new Product();
    
    product.id = 1;
    product.name = 'Test Product';
    product.description = 'Test Description';
    product.price = 10.99;
    product.quantity = 5;

    expect(product.id).toBe(1);
    expect(product.name).toBe('Test Product');
    expect(product.description).toBe('Test Description');
    expect(product.price).toBe(10.99);
    expect(product.quantity).toBe(5);
  });

  it('should handle different data types correctly', () => {
    const product = new Product();
    
    product.id = 0;
    product.name = '';
    product.description = null as any;
    product.price = 0;
    product.quantity = 0;

    expect(product.id).toBe(0);
    expect(product.name).toBe('');
    expect(product.description).toBeNull();
    expect(product.price).toBe(0);
    expect(product.quantity).toBe(0);
  });

  it('should work with large numbers', () => {
    const product = new Product();
    
    product.id = 999999;
    product.price = 999999.99;
    product.quantity = 999999;

    expect(product.id).toBe(999999);
    expect(product.price).toBe(999999.99);
    expect(product.quantity).toBe(999999);
  });

  it('should work with decimal prices', () => {
    const product = new Product();
    
    product.price = 10.50;
    product.price = 0.99;
    product.price = 1000.01;

    expect(product.price).toBe(1000.01);
  });
});
