import { Component, OnInit, inject, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from './product-model';
import { ProductService } from './product-service';
import { ErrorService } from '../error-handling/error.service';
import { LoadingService } from '../shared/loading.service';
import { SkeletonLoadingComponent } from '../shared/skeleton-loading.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, SkeletonLoadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  private productService = inject(ProductService);
  private errorService = inject(ErrorService);
  private loadingService = inject(LoadingService);

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
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loading = true;
    this.loadingService.show();

    // Simulate loading delay for better UX
    setTimeout(() => {
      try {
        this.products = this.productService.getProducts() || [];
        this.invalidateCache(); // Reset cache when products change
        
        if (this.products.length === 0) {
          this.errorService.showInfo('No products found. Add your first product to get started!');
        }
      } catch (error) {
        this.errorService.showError(
          'Failed to load products',
          error instanceof Error ? error.message : 'An unexpected error occurred'
        );
      } finally {
        this.loading = false;
        this.loadingService.hide();
      }
    }, 500);
  }

  private _totalValueCache: number | null = null;

  trackByProductId(index: number, product: Product): number {
    return product.id || index;
  }

  getTotalInventoryValue(): number {
    if (this._totalValueCache === null) {
      this._totalValueCache = this.products.reduce((total, product) => {
        return total + ((product.price || 0) * (product.quantity || 0));
      }, 0);
    }
    return this._totalValueCache;
  }

  private invalidateCache(): void {
    this._totalValueCache = null;
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
        this.invalidateCache(); // Reset cache after deletion
      }
    } catch (error) {
      this.errorService.showError(
        'Failed to delete product',
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }
}
