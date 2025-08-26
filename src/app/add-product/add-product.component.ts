import { Component, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Product } from '../product-list/product-model';
import { ProductService } from '../product-list/product-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent {
  private productService = inject(ProductService);
  private router = inject(Router);
  addProduct(productForm: NgForm) {
    const product = new Product();
    product.name = productForm.value.name;
    product.description = productForm.value.description;
    product.price = productForm.value.price;
    product.quantity = productForm.value.quantity;

    this.productService.addProduct(product);
    console.log('product');
    console.log(product);
  }
}
