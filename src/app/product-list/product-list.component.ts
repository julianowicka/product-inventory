import {Component, OnInit} from '@angular/core';
import {Product} from "./product-model";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit{
  products: Product[] = [];

  ngOnInit(): void {
    for (let i = 0; i<10; i++){
      const product = new Product()
      product.name = `Product ${i}`;
      product.description = `Descrition ${i}`;
      product.price = i + 1;
      product.quantity = i +1;
      this.products.push(product)
    }
  }
}
