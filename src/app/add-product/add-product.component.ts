import { Component, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Product } from '../product-list/product-model';
import { ProductService } from '../product-list/product-service';
import { Router } from '@angular/router';
import { ErrorService } from '../error-handling/error.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent {
  private productService = inject(ProductService);
  private router = inject(Router);
  private errorService = inject(ErrorService);

  addProduct(productForm: NgForm): void {
    try {
      if (!productForm.valid) {
        this.errorService.showWarning('Please fill in all required fields correctly');
        return;
      }

      const formValue = productForm.value;
      
      // Validate form data
      if (!formValue.name || formValue.name.trim() === '') {
        this.errorService.showError('Product name is required');
        return;
      }

      if (!formValue.price || formValue.price <= 0) {
        this.errorService.showError('Product price must be greater than 0');
        return;
      }

      if (!formValue.quantity || formValue.quantity < 0) {
        this.errorService.showError('Product quantity cannot be negative');
        return;
      }

      const product = new Product();
      product.name = formValue.name.trim();
      product.description = formValue.description || '';
      product.price = Number(formValue.price);
      product.quantity = Number(formValue.quantity);

      this.productService.addProduct(product);
      
      // Reset form after successful addition
      productForm.resetForm();
      
      // Navigate back to product list
      this.router.navigate(['/products']);
      
    } catch (error) {
      this.errorService.showError(
        'Failed to add product',
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }
}
