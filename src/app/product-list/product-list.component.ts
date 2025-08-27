import { Component, OnInit, inject, HostListener } from '@angular/core';
import { Product } from './product-model';
import { ProductService } from './product-service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  private productService = inject(ProductService);

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
    this.products = this.productService.getProducts();

    for (let i = 0; i < 10; i++) {
      const product = new Product();
      product.name = `Product ${i}`;
      product.description = `Description ${i}`;
      product.price = i + 1;
      product.quantity = i + 1;
      this.products.push(product);
    }
  }

  deleteProducts(id?: number): void {
    if (id !== undefined && confirm(`Are you sure you want to delete this product?`)) {
      this.productService.deleteProducts(id);
    }
  }
}
