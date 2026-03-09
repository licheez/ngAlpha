import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';

export interface ICssScrollerDemoItem {
  id: string;
  title: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class CssScrollerDemoService {
  private items: ICssScrollerDemoItem[] = [];

  constructor() {
    this.generateItems();
  }

  private generateItems(): void {
    const loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

    for (let i = 0; i < 1000; i++) {
      const minLength = 30;
      const maxLength = 400;
      const randomLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
      const description = loremIpsum.substring(0, randomLength);

      this.items.push({
        id: `item-${i}`,
        title: `Item ${i + 1}`,
        description: description
      });
    }
  }

  list(skip: number, take: number): Observable<ICssScrollerDemoItem[]> {
    console.log(`CssScrollerDemoService.list: skip=${skip}, take=${take}, totalItems=${this.items.length}`);

    return new Observable((subscriber: Subscriber<ICssScrollerDemoItem[]>) => {
      const result = this.items.slice(skip, skip + take);
      console.log(`CssScrollerDemoService.list: returning ${result.length} items`);

      // Simulate network delay
      const delay = Math.random() * 300;
      setTimeout(() => {
        subscriber.next(result);
        subscriber.complete();
      }, delay);
    });
  }
}

