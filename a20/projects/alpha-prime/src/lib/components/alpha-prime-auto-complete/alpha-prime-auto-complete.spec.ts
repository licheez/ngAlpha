import {AlphaPrimeAutoComplete, IAlphaPrimeAutoCompleteEntry} from "./alpha-prime-auto-complete";
import {Observable, of} from "rxjs";

describe('AlphaPrimeAutoComplete', () => {
  it('should create an instance', () => {
    expect(true).toBeTruthy();
  });

  it('should map a feeder', () => {
    type Person = {
      id: string,
      firstName: string;
    };
    const pierre: Person = {id: '1', firstName: 'pierre'};
    const peter: Person = {id: '2', firstName: 'peter'};
    const feeder: (term: string) => Observable<Person[]> =
      () => of([pierre, peter]);

    const mapper: (item: Person) => IAlphaPrimeAutoCompleteEntry =
      (item: Person) => {
        return {
          id: item.id,
          caption: item.firstName,
          data: item
        }
      };

    AlphaPrimeAutoComplete.mapFeeder('p', feeder, mapper)
      .subscribe({
        next: entries => {
          expect(entries.length).toEqual(2);
          expect(entries[0].id).toEqual('1');
          expect(entries[0].caption).toEqual('pierre');
          expect(entries[0].data).toBe(pierre);
          expect(entries[1].id).toEqual('2');
          expect(entries[1].caption).toEqual('peter');
          expect(entries[1].data).toBe(peter);
        }
      });

  });

});
