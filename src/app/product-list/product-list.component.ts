import { Component, OnInit, inject, HostListener } from '@angular/core';
import { Product } from './product-model';
import { ProductService } from './product-service';
import { ErrorService } from '../error-handling/error.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  private productService = inject(ProductService);
  private errorService = inject(ErrorService);

  @HostListener('keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      const target = event.target as HTMLElement;
      if (target.tagName === 'BUTTON') {
        event.preventDefault();
        const productId = target.getAttribute('data-product-id');
        if (productId) {
          this.deleteProducts(Number(productId));
        }
      }
    }
  }
  ngOnInit(): void {
    try {
      this.products = this.productService.getProducts() || [];
      
      if (this.products.length === 0) {
        this.errorService.showInfo('No products found. Add your first product to get started!');
      }
    } catch (error) {
      this.errorService.showError(
        'Failed to load products',
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }

  deleteProducts(id?: number): void {
    try {
      if (id === undefined) {
        this.errorService.showWarning('No product selected for deletion');
        return;
      }

      const product = this.products.find(p => p.id === id);
      if (!product) {
        this.errorService.showError('Product not found');
        return;
      }

      if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
        this.productService.deleteProducts(id);
        // Refresh the products list
        this.products = this.productService.getProducts() || [];
      }
    } catch (error) {
      this.errorService.showError(
        'Failed to delete product',
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }
}
