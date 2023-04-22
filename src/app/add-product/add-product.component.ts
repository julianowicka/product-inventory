import { Component } from '@angular/core';
import {NgForm} from "@angular/forms";
import {Product} from "../product-list/product-model";
import {ProductService} from "../product-list/product-service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {
  constructor(private productService: ProductService,
    private router: Router){
  }
  addProduct(productForm: NgForm){
    const product = new Product();
    product.name = productForm.value.name;
    product.description = productForm.value.description;
    product.price = productForm.value.price;
    product.quantity = productForm.value.quantity;

    this.productService.addProduct(product)
    console.log("product");
    console.log(product);
  }

  protected readonly onsubmit = onsubmit;
}
