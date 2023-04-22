import { Injectable} from "@angular/core";
import { Product} from "./product-model";
import {elementAt} from "rxjs";

@Injectable()
export class ProductService{
  private _products: Product[] = [];
  addProduct(product: Product){
    product.id = this._products.length;
    this._products.push(product);
  }
  getProducts(): Product[] {
    return this._products;
  }
  deleteProducts(id?: number){
    const index = this._products.findIndex(p => p.id === id);
    this._products.splice(index, 1);
  }
}
