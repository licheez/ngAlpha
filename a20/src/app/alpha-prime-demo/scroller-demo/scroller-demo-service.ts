import { Injectable } from '@angular/core';
import {Observable, Subscriber} from 'rxjs';
import {IScrollerDemoCardData, ScrollerDemoCardData} from './scroller-demo-model';

@Injectable({
  providedIn: 'root'
})
export class ScrollerDemoService {

  items: IScrollerDemoCardData[] = [];

  private readonly loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.`;

  constructor() {
    this.generateItems();
  }

  private generateItems(): void {
    for (let i = 0; i < 1000; i++) {
      const minLength = 30;
      const maxLength = 400;
      const randomLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

      // Generate description by repeating lorem ipsum and trimming to desired length
      let description = this.loremIpsum;
      while (description.length < randomLength) {
        description += ' ' + this.loremIpsum;
      }
      description = description.substring(0, randomLength).trim();

      this.items.push(new ScrollerDemoCardData(
        `item-${i}`,
        `Item ${i + 1}`,
        description
      ));
    }
  }

  list(skip: number, take: number): Observable<IScrollerDemoCardData[]>{
    console.log(`ScrollerDemoService.list: skip=${skip}, take=${take}, totalItems=${this.items.length}`);
    return new Observable((subscriber: Subscriber<IScrollerDemoCardData[]>) => {
      const result = this.items.slice(skip, skip + take);
      console.log(`ScrollerDemoService.list: returning ${result.length} items`);
      // Simulate network delay
      const delay = Math.random() * 500;
      setTimeout(() => {
        subscriber.next(result);
        subscriber.complete();
      }, delay);
    });
  }
}
