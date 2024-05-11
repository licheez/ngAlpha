import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable, of, Subscription} from "rxjs";
import {IAlphaPrimeAutoCompleteEntry} from "./alpha-prime-auto-complete";
import {NgClass, NgIf} from "@angular/common";

import {FormsModule} from "@angular/forms";
import {AutoCompleteModule} from "primeng/autocomplete";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {InputTextModule} from "primeng/inputtext";
import {AlphaPrimeBoldifyPipe} from "../../pipes/alpha-prime-boldify.pipe";

/*
https://github.com/primefaces/primeng/issues/1552

how to make ng prime autocomplete full width

In template
-----------
[style]="{'width':'100%'}"
[inputStyle]="{'width':'100%'}"
class="p-autocomplete"

In css
------
.p-autocomplete{
    width: 100%;
  }
*/

@Component({
  selector: 'alpha-prime-auto-complete',
  standalone: true,
  imports: [
    // ANGULAR
    FormsModule,
    NgIf,
    NgClass,
    // ALPHA
    AlphaPrimeBoldifyPipe,
    // PRIME
    AutoCompleteModule,
    ButtonModule,
    InputTextModule,
    RippleModule
  ],
  templateUrl: './alpha-prime-auto-complete.component.html',
  styleUrls: ['./alpha-prime-auto-complete.component.css']
})
export class AlphaPrimeAutoCompleteComponent {
  @Input() feeder: (term: string) => Observable<IAlphaPrimeAutoCompleteEntry[]>
    = () => of([]);
  @Input()
  set entry(entry: IAlphaPrimeAutoCompleteEntry | undefined) {
    this.model = entry;
    if (entry === undefined) {
      this.term = '';
      this.valid = false;
    } else {
      this.term = entry.caption;
      this.valid = true;
    }
  }
  @Input() disabled = false;
  @Input() placeHolder = '';
  @Input() emptyMessage = '';
  @Input() clearOnSelect = false;
  @Input() showAdd = false;
  @Input() readonly = false;
  @Input() readonlyCaption = '';
  @Input() sm = false;
  @Output() cleared = new EventEmitter();
  @Output() selected = new EventEmitter<IAlphaPrimeAutoCompleteEntry>();
  @Output() addClicked = new EventEmitter<string>();

  baseInputStyle = {
    'width': '100%',
    'border-top-right-radius': '0',
    'border-bottom-right-radius': '0'
  };

  smInputStyle = {
    'width': '100%',
    'border-top-right-radius': '0',
    'border-bottom-right-radius': '0',
    'font-size': 'x-small'
  };

  get inputStyle(): any {
    return this.sm
      ? this.smInputStyle
      : this.baseInputStyle;
  }

  model: IAlphaPrimeAutoCompleteEntry | undefined;
  term = '';
  searching = false;
  searchFailed = false;
  valid = false;
  feedTimer: any;
  feed: Subscription | undefined;

  constructor() { }

  suggestions: IAlphaPrimeAutoCompleteEntry[] = [];

  onFeed(event: any) {
    if (this.feedTimer) {
      clearTimeout(this.feedTimer);
    }
    this.feedTimer = setTimeout(
      () => {
        this.term = event.query;
        if (this.term === '') {
          this.clear(true);
          return;
        }
        if (this.term === '*') {
          this.term = '%'
        }
        this.searching = true;
        this.valid = false;
        this.searchFailed = false;

        this.feed = this.feeder(this.term)
          .subscribe({
            next: (suggestions: IAlphaPrimeAutoCompleteEntry[]) => {
              this.suggestions = suggestions;
              this.searching = false;
            },
            error: (error: any) => {
              console.error = error;
              this.searchFailed = true;
              this.searching = false;
            }
          });
      }, 500);
  }

  clear(emit: boolean): void {
    if (this.feedTimer) {
      clearTimeout(this.feedTimer);
      this.feedTimer = undefined;
    }
    if (this.feed) {
      this.feed.unsubscribe();
    }
    this.suggestions = [];
    this.model = undefined;
    this.valid = false;
    this.term = '';
    if (emit) {
      this.cleared.emit();
    }
  }

  onClear(): void {
    this.clear(true);
  }

  onSelected(event: any): void {
    const entry = event.value as IAlphaPrimeAutoCompleteEntry
    this.term = entry.caption;
    this.selected.emit(entry);
    this.valid = true;
    if (this.clearOnSelect) {
      setTimeout(() => {
        this.clear(false);
      }, 100);
    }
  }

  onAdd(): void {
    this.addClicked.emit(this.term);
  }

}
