import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchSubject = new BehaviorSubject<string>('');
  public searchResults$: Observable<string>;

  constructor() {
    this.searchResults$ = this.searchSubject.pipe(
      debounceTime(300), // Wait 300ms after user stops typing
      distinctUntilChanged(), // Only emit if value has changed
      switchMap(searchTerm => {
        // Simulate API call or processing
        return new Observable<string>(observer => {
          observer.next(searchTerm);
          observer.complete();
        });
      })
    );
  }

  search(term: string): void {
    this.searchSubject.next(term);
  }

  getSearchTerm(): string {
    return this.searchSubject.value;
  }

  clearSearch(): void {
    this.searchSubject.next('');
  }
}
