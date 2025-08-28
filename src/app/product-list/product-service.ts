import { Injectable } from '@angular/core';
import { Product } from './product-model';
import { ErrorService } from '../error-handling/error.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private _products: Product[] = [];
  private nextId = 1;
  private _productsCache: Product[] | null = null;

  constructor(private errorService: ErrorService) {}

  addProduct(product: Product): void {
    try {
      if (!product.name || product.name.trim() === '') {
        throw new Error('Product name is required');
      }

      if (!product.price || product.price <= 0) {
        throw new Error('Product price must be greater than 0');
      }

      if (!product.quantity || product.quantity < 0) {
        throw new Error('Product quantity cannot be negative');
      }

      product.id = this.nextId++;
      this._products.push(product);
      this._productsCache = null; // Invalidate cache
      
      this.errorService.showSuccess(
        `Product "${product.name}" added successfully`,
        `Product ID: ${product.id}`
      );
    } catch (error) {
      this.errorService.showError(
        'Failed to add product',
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
      throw error;
    }
  }

  getProducts(): Product[] {
    if (this._productsCache === null) {
      this._productsCache = [...this._products];
    }
    return this._productsCache;
  }

  deleteProducts(id?: number): void {
    try {
      if (id === undefined) {
        this.errorService.showWarning('No product ID provided for deletion');
        return;
      }

      const product = this._products.find((p) => p.id === id);
      if (!product) {
        this.errorService.showWarning(
          'Product not found',
          `Product with ID ${id} does not exist`
        );
        return;
      }

      const index = this._products.findIndex((p) => p.id === id);
      if (index !== -1) {
        this._products.splice(index, 1);
        this._productsCache = null; // Invalidate cache
        this.errorService.showSuccess(
          `Product "${product.name}" deleted successfully`,
          `Product ID: ${id}`
        );
      }
    } catch (error) {
      this.errorService.showError(
        'Failed to delete product',
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    }
  }
}
