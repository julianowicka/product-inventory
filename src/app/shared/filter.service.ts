import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Product } from '../product-list/product-model';

export interface FilterCriteria {
  searchTerm: string;
  minPrice: number | null;
  maxPrice: number | null;
  minQuantity: number | null;
  maxQuantity: number | null;
  sortBy: 'name' | 'price' | 'quantity' | 'id';
  sortOrder: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private filterSubject = new BehaviorSubject<FilterCriteria>({
    searchTerm: '',
    minPrice: null,
    maxPrice: null,
    minQuantity: null,
    maxQuantity: null,
    sortBy: 'name',
    sortOrder: 'asc'
  });

  public filterCriteria$ = this.filterSubject.asObservable();

  updateFilter(criteria: Partial<FilterCriteria>): void {
    const currentCriteria = this.filterSubject.value;
    this.filterSubject.next({ ...currentCriteria, ...criteria });
  }

  filterProducts(products: Product[]): Observable<Product[]> {
    return this.filterCriteria$.pipe(
      debounceTime(300),
      map(criteria => this.applyFilters(products, criteria))
    );
  }

  private applyFilters(products: Product[], criteria: FilterCriteria): Product[] {
    let filteredProducts = [...products];

    // Apply search filter
    if (criteria.searchTerm.trim()) {
      const searchTerm = criteria.searchTerm.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name?.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply price filters
    if (criteria.minPrice !== null) {
      filteredProducts = filteredProducts.filter(product => 
        (product.price || 0) >= criteria.minPrice!
      );
    }

    if (criteria.maxPrice !== null) {
      filteredProducts = filteredProducts.filter(product => 
        (product.price || 0) <= criteria.maxPrice!
      );
    }

    // Apply quantity filters
    if (criteria.minQuantity !== null) {
      filteredProducts = filteredProducts.filter(product => 
        (product.quantity || 0) >= criteria.minQuantity!
      );
    }

    if (criteria.maxQuantity !== null) {
      filteredProducts = filteredProducts.filter(product => 
        (product.quantity || 0) <= criteria.maxQuantity!
      );
    }

    // Apply sorting
    filteredProducts.sort((a, b) => {
      let aValue: any = a[criteria.sortBy];
      let bValue: any = b[criteria.sortBy];

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) aValue = '';
      if (bValue === null || bValue === undefined) bValue = '';

      // Convert to lowercase for string comparison
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (criteria.sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filteredProducts;
  }

  getFilterSummary(products: Product[], filteredProducts: Product[]): any {
    const totalProducts = products.length;
    const filteredCount = filteredProducts.length;
    const hiddenCount = totalProducts - filteredCount;

    return {
      total: totalProducts,
      filtered: filteredCount,
      hidden: hiddenCount,
      percentage: totalProducts > 0 ? Math.round((filteredCount / totalProducts) * 100) : 0
    };
  }

  clearFilters(): void {
    this.updateFilter({
      searchTerm: '',
      minPrice: null,
      maxPrice: null,
      minQuantity: null,
      maxQuantity: null,
      sortBy: 'name',
      sortOrder: 'asc'
    });
  }
}
