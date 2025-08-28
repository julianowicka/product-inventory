import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from './product-list/product-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddProductComponent } from './add-product/add-product.component';
import { FormsModule } from '@angular/forms';
import { ProductService } from './product-list/product-service';
import { ErrorDisplayComponent } from './error-handling/error-display.component';

@NgModule({
  declarations: [AppComponent, ErrorDisplayComponent],
  imports: [BrowserModule, AppRoutingModule, NgbModule, FormsModule, CommonModule],
  providers: [ProductService],
  bootstrap: [AppComponent],
})
export class AppModule {}
