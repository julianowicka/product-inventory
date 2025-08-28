import { Injectable } from '@angular/core';
import { Product } from '../product-list/product-model';

export interface ExportOptions {
  format: 'csv' | 'json';
  includeHeaders?: boolean;
  filename?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  exportProducts(products: Product[], options: ExportOptions): void {
    const filename = options.filename || `products-${new Date().toISOString().split('T')[0]}`;
    
    if (options.format === 'csv') {
      this.exportToCSV(products, filename, options.includeHeaders);
    } else if (options.format === 'json') {
      this.exportToJSON(products, filename);
    }
  }

  private exportToCSV(products: Product[], filename: string, includeHeaders: boolean = true): void {
    const headers = ['ID', 'Name', 'Description', 'Price', 'Quantity'];
    const csvContent = [
      includeHeaders ? headers.join(',') : '',
      ...products.map(product => [
        product.id || '',
        `"${product.name || ''}"`,
        `"${product.description || ''}"`,
        product.price || 0,
        product.quantity || 0
      ].join(','))
    ].filter(row => row).join('\n');

    this.downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  }

  private exportToJSON(products: Product[], filename: string): void {
    const jsonContent = JSON.stringify(products, null, 2);
    this.downloadFile(jsonContent, `${filename}.json`, 'application/json');
  }

  private downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  generateReport(products: Product[]): any {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, product) => 
      sum + ((product.price || 0) * (product.quantity || 0)), 0
    );
    const averagePrice = totalProducts > 0 ? 
      products.reduce((sum, product) => sum + (product.price || 0), 0) / totalProducts : 0;
    
    const lowStockProducts = products.filter(product => (product.quantity || 0) < 5);
    const outOfStockProducts = products.filter(product => (product.quantity || 0) === 0);

    return {
      summary: {
        totalProducts,
        totalValue,
        averagePrice: Math.round(averagePrice * 100) / 100,
        lowStockCount: lowStockProducts.length,
        outOfStockCount: outOfStockProducts.length
      },
      lowStockProducts,
      outOfStockProducts,
      generatedAt: new Date().toISOString()
    };
  }

  exportReport(report: any, filename?: string): void {
    const reportFilename = filename || `inventory-report-${new Date().toISOString().split('T')[0]}`;
    this.exportToJSON(report, reportFilename);
  }
}
