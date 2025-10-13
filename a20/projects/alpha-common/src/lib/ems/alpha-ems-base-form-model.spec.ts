import { Observable } from 'rxjs';
import {AlphaEmsBaseFormModel} from './alpha-ems-base-form-model';

describe('AlphaEmsBaseFormModel', () => {
  class Fm extends AlphaEmsBaseFormModel<any, any, any> {
      override invalid = false;
      override populateForRead(body: any): void {
          throw new Error('Method not implemented.');
      }
      override populateForNew(ei: any): void {
          throw new Error('Method not implemented.');
      }
      override populateForEdit(ei: any, body: any): void {
          throw new Error('Method not implemented.');
      }
      override createEntity(): Observable<any> {
          throw new Error('Method not implemented.');
      }
      override updateEntity(): Observable<any> {
          throw new Error('Method not implemented.');
      }

  }
  it('should create an instance', () => {
    expect(new Fm()).toBeTruthy();
  });
});
