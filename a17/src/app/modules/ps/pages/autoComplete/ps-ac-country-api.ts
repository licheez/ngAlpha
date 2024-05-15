import {IPsAcCountry} from "./ps-ac-country";
import {Observable, Subscriber} from "rxjs";
import {AlphaUtils} from "@pvway/alpha-common";

export class PsAcCountryApi {
  private contries: IPsAcCountry[] = [
    { iso: 'AT', name: 'Austria' },
    { iso: 'BE', name: 'Belgium'},
    { iso: 'DE', name: 'Germany'},
    { iso: 'ES', name: 'Spain'},
    { iso: 'FR', name: 'France'},
    { iso: 'NL', name: 'Netherlands'}
  ];

  list(term: string): Observable<IPsAcCountry[]> {
    term = term.toLowerCase();
    const items = this.contries.filter(
      c => AlphaUtils.contains(c.name.toLowerCase(), term));
    return new Observable<IPsAcCountry[]>(
      (subscriber: Subscriber<IPsAcCountry[]>) => {
        setTimeout(() => subscriber.next(items),
          500);
      });
  }
}
