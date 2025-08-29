import { Component, OnInit, inject, HostListener, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from './product-model';
import { ProductService } from './product-service';
import { ErrorService } from '../error-handling/error.service';
import { LoadingService } from '../shared/loading.service';
import { SkeletonLoadingComponent } from '../shared/skeleton-loading.component';
import { FilterService } from '../shared/filter.service';
import { AdvancedFilterComponent } from '../shared/advanced-filter.component';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, SkeletonLoadingComponent, AdvancedFilterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = false;
  private productService = inject(ProductService);
  private errorService = inject(ErrorService);
  private loadingService = inject(LoadingService);
  private filterService = inject(FilterService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

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
    this.setupFiltering();
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.refreshProducts();
    });
  }

  ngOnDestroy(): void {
  }

  private loadProducts(): void {
    this.loading = true;
    this.cdr.detectChanges(); // Force change detection for loading state
    this.loadingService.show();

    // Simulate loading delay for better UX
    setTimeout(() => {
      try {
        this.products = this.productService.getProducts() || [];
        this.filteredProducts = [...this.products];
        this.invalidateCache(); // Reset cache when products change
        this.setupFiltering(); // Re-setup filtering with new products
        
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
        this.cdr.detectChanges(); // Force change detection after loading
      }
    }, 300);
  }

  refreshProducts(): void {
    this.loadProducts();
  }

  private _totalValueCache: number | null = null;

  trackByProductId(index: number, product: Product): number {
    return product.id || index;
  }

  getTotalInventoryValue(): number {
    if (this._totalValueCache === null) {
      this._totalValueCache = this.filteredProducts.reduce((total, product) => {
        return total + ((product.price || 0) * (product.quantity || 0));
      }, 0);
    }
    return this._totalValueCache;
  }

  private invalidateCache(): void {
    this._totalValueCache = null;
  }

  private setupFiltering(): void {
    this.filterService.filterProducts(this.products).subscribe(filteredProducts => {
      this.filteredProducts = filteredProducts;
      this.invalidateCache();
    });
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
        this.refreshProducts();
      }
    } catch (error) {
      this.errorService.showError(
        'Failed to delete product',
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }
}
