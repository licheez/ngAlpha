import { AlphaPrimeFilterBoxComponent  }
  from "../../../projects/alpha-prime/src/lib/components/alpha-prime-filter-box/alpha-prime-filter-box.component";

import { Component } from "@angular/core";

@Component({
  selector: 'app-filter-box-demo',
  template: `
    <section>
      <h2>Alpha Prime - Filter Box Demo</h2>

      <h3>Basic Usage with Two-Way Binding</h3>
      <p>Current term: <strong>{{ term ?? '(empty)' }}</strong></p>
      <alpha-prime-filter-box
          [delay]="500"
          [(term)]="term"
          [showAdd]="true"
          [placeholder]="'Search...'"
          (addClicked)="onAddClicked($event)"
      ></alpha-prime-filter-box>

      <h3>Disabled State</h3>
      <alpha-prime-filter-box
          [disabled]="true"
          [placeholder]="'Disabled input'"
      ></alpha-prime-filter-box>

      <h3>Without Add Button</h3>
      <alpha-prime-filter-box
          [showAdd]="false"
          [(term)]="term2"
          [placeholder]="'Filter items...'"
      ></alpha-prime-filter-box>
      <p>Term 2: <strong>{{ term2 ?? '(empty)' }}</strong></p>
    </section>
  `,
  imports: [
    AlphaPrimeFilterBoxComponent]
})
export class FilterBoxComponent {
  term: string | undefined;
  term2: string | undefined;

  onAddClicked(term: string | undefined): void {
    alert(`Add clicked with term: ${term}`);
  }
}
