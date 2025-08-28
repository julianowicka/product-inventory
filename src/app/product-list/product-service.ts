import { Injectable } from '@angular/core';
import { Product } from './product-model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private _products: Product[] = [];

  addProduct(product: Product) {
    product.id = this._products.length;
    this._products.push(product);
  }

  getProducts(): Product[] {
    return this._products;
  }

  deleteProducts(id?: number) {
    if (id === undefined) return;
    const index = this._products.findIndex((p) => p.id === id);
    if (index !== -1) {
      this._products.splice(index, 1);
    }
  }
}
