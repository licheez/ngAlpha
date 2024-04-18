import {map, Observable} from "rxjs";

export interface IAlphaPrimeAutoCompleteEntry {
  id: string;
  caption: any;
  data?: any;
}

export class AlphaPrimeAutoComplete {

  /**
   * Helper that eases the translation of a service feeder
   * returning domain entities to a view feeder returning
   * @param term the searched term
   * @param feeder a method that returns an observable of <T> items for the given term
   * @param mapper a method that converts a T item into a IAlphaAutoComplete item
   * @return  array of IAlphaAutoComplete entries
   */
  static mapFeeder<T>(
    term: string,
    feeder: (term: string) => Observable<T[]>,
    mapper: (item: T) => IAlphaPrimeAutoCompleteEntry): Observable<IAlphaPrimeAutoCompleteEntry[]> {
    return feeder(term)
      .pipe(
        map((items: T[]) => items
          .map((item: T) => mapper(item))));
  }
}
