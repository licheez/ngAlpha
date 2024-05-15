import { Component } from '@angular/core';
import {
  AlphaPrimeAutoComplete,
  AlphaPrimeAutoCompleteComponent,
  IAlphaPrimeAutoCompleteEntry
} from "@pvway/alpha-prime";
import {PsAcCountryApi} from "../ps-ac-country-api";
import {IPsAcCountry} from "../ps-ac-country";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-ps-auto-complete-page',
  standalone: true,
  imports: [
    AlphaPrimeAutoCompleteComponent,
    NgIf
  ],
  templateUrl: './ps-auto-complete-page.component.html',
  styleUrl: './ps-auto-complete-page.component.scss'
})
export class PsAutoCompletePageComponent {

  api = new PsAcCountryApi();

  entry: IAlphaPrimeAutoCompleteEntry | undefined = {
    id: 'BE',
    caption: 'Belgium',
    data: {
      iso: 'BE',
      name: 'Belgium'
    }
  };
  
  get selectedCountry(): IPsAcCountry | undefined {
    return this.entry?.data;
  }

  feeder = (term: string) => AlphaPrimeAutoComplete
      .mapFeeder(
        term,
        term => this.api.list(term),
        country => {
          return {
            id: country.iso,
            caption: country.name,
            data: country
          }});

  onSelected(entry: IAlphaPrimeAutoCompleteEntry): void {
    this.entry=entry;
  }

  onCleared(): void {
    this.entry = undefined;
  }

}
