import { Component, OnInit, inject, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterService, FilterCriteria } from './filter.service';
import { ExportService } from './export.service';
import { Product } from '../product-list/product-model';

@Component({
  selector: 'app-advanced-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card mb-4">
      <div class="card-header">
        <h5 class="card-title mb-0">
          <i class="fas fa-filter me-2"></i>
          Advanced Filters & Export
        </h5>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <!-- Search -->
          <div class="col-md-6">
            <label for="searchInput" class="form-label">Search</label>
            <input
              type="text"
              id="searchInput"
              class="form-control"
              placeholder="Search by name or description..."
              [(ngModel)]="searchTerm"
              (input)="onSearchChange()"
            >
          </div>

          <!-- Sort -->
          <div class="col-md-3">
            <label for="sortBy" class="form-label">Sort By</label>
            <select id="sortBy" class="form-select" [(ngModel)]="sortBy" (change)="onSortChange()">
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="quantity">Quantity</option>
              <option value="id">ID</option>
            </select>
          </div>

          <div class="col-md-3">
            <label for="sortOrder" class="form-label">Order</label>
            <select id="sortOrder" class="form-select" [(ngModel)]="sortOrder" (change)="onSortChange()">
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          <!-- Price Range -->
          <div class="col-md-3">
            <label for="minPrice" class="form-label">Min Price</label>
            <input
              type="number"
              id="minPrice"
              class="form-control"
              placeholder="0"
              [(ngModel)]="minPrice"
              (input)="onPriceChange()"
              min="0"
              step="0.01"
            >
          </div>

          <div class="col-md-3">
            <label for="maxPrice" class="form-label">Max Price</label>
            <input
              type="number"
              id="maxPrice"
              class="form-control"
              placeholder="1000"
              [(ngModel)]="maxPrice"
              (input)="onPriceChange()"
              min="0"
              step="0.01"
            >
          </div>

          <!-- Quantity Range -->
          <div class="col-md-3">
            <label for="minQuantity" class="form-label">Min Quantity</label>
            <input
              type="number"
              id="minQuantity"
              class="form-control"
              placeholder="0"
              [(ngModel)]="minQuantity"
              (input)="onQuantityChange()"
              min="0"
            >
          </div>

          <div class="col-md-3">
            <label for="maxQuantity" class="form-label">Max Quantity</label>
            <input
              type="number"
              id="maxQuantity"
              class="form-control"
              placeholder="100"
              [(ngModel)]="maxQuantity"
              (input)="onQuantityChange()"
              min="0"
            >
          </div>

          <!-- Actions -->
          <div class="col-12">
            <div class="d-flex gap-2 flex-wrap">
              <button class="btn btn-outline-secondary" (click)="clearFilters()">
                <i class="fas fa-times me-1"></i>
                Clear Filters
              </button>
              
              <div class="dropdown">
                <button class="btn btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                  <i class="fas fa-download me-1"></i>
                  Export
                </button>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#" (click)="exportCSV()">Export as CSV</a></li>
                  <li><a class="dropdown-item" href="#" (click)="exportJSON()">Export as JSON</a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item" href="#" (click)="exportReport()">Export Report</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Filter Summary -->
        <div *ngIf="filterSummary" class="mt-3">
          <div class="alert alert-info">
            <i class="fas fa-info-circle me-2"></i>
            Showing {{ filterSummary.filtered }} of {{ filterSummary.total }} products 
            ({{ filterSummary.percentage }}%)
            <span *ngIf="filterSummary.hidden > 0" class="text-muted">
              - {{ filterSummary.hidden }} hidden by filters
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: none;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .form-control:focus,
    .form-select:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 0.2rem rgba(99, 102, 241, 0.25);
    }
    
    .dropdown-item:hover {
      background-color: var(--primary-color);
      color: white;
    }
  `]
})
export class AdvancedFilterComponent implements OnInit, OnChanges {
  private filterService = inject(FilterService);
  private exportService = inject(ExportService);

  // Filter properties
  searchTerm = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  minQuantity: number | null = null;
  maxQuantity: number | null = null;
  sortBy: 'name' | 'price' | 'quantity' | 'id' = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';

  // Data
  @Input() allProducts: Product[] = [];
  @Input() filteredProducts: Product[] = [];
  filterSummary: any = null;

  ngOnInit(): void {
    this.updateFilterSummary();
  }

  ngOnChanges(): void {
    this.updateFilterSummary();
  }

  setProducts(products: Product[]): void {
    this.allProducts = products;
    this.updateFilterSummary();
  }

  setFilteredProducts(products: Product[]): void {
    this.filteredProducts = products;
    this.updateFilterSummary();
  }

  onSearchChange(): void {
    this.filterService.updateFilter({ searchTerm: this.searchTerm });
  }

  onSortChange(): void {
    this.filterService.updateFilter({ 
      sortBy: this.sortBy, 
      sortOrder: this.sortOrder 
    });
  }

  onPriceChange(): void {
    this.filterService.updateFilter({ 
      minPrice: this.minPrice, 
      maxPrice: this.maxPrice 
    });
  }

  onQuantityChange(): void {
    this.filterService.updateFilter({ 
      minQuantity: this.minQuantity, 
      maxQuantity: this.maxQuantity 
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.minQuantity = null;
    this.maxQuantity = null;
    this.sortBy = 'name';
    this.sortOrder = 'asc';
    
    this.filterService.clearFilters();
  }

  exportCSV(): void {
    this.exportService.exportProducts(this.filteredProducts, {
      format: 'csv',
      includeHeaders: true,
      filename: 'filtered-products'
    });
  }

  exportJSON(): void {
    this.exportService.exportProducts(this.filteredProducts, {
      format: 'json',
      filename: 'filtered-products'
    });
  }

  exportReport(): void {
    const report = this.exportService.generateReport(this.allProducts);
    this.exportService.exportReport(report, 'inventory-report');
  }

  private updateFilterSummary(): void {
    if (this.allProducts.length > 0) {
      this.filterSummary = this.filterService.getFilterSummary(
        this.allProducts, 
        this.filteredProducts
      );
    }
  }
}
