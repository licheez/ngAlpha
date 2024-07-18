import {AlphaEmsBaseComponent} from './alpha-ems-base-component';
import {AlphaEmsBaseApi} from "./alpha-ems-base-api";
import {HttpClient} from "@angular/common/http";
import {Observable, of, throwError} from 'rxjs';
import {AlphaEmsFormInput} from "./alpha-ems-form-input";
import {AlphaEmsFormResult} from "./alpha-ems-form-result";
import {AlphaEmsService} from "./alpha-ems.service";
import {IAlphaHttpObjectResultDso} from "../http/alpha-http-result";
import {AlphaEmsBaseFormModel} from "./alpha-ems-base-form-model";

interface IHead {
  id: string,
  name: string
}

interface IBody extends IHead {
  age: number
}

interface IEi {
  selectItems: string[]
}

class Factory {
  static factorHeadFromDso(dso: any): IHead {
    return {
      id: dso.id,
      name: dso.name
    };
  }

  static factorBodyFromDso(dso: any): IBody {
    return {
      id: dso.id,
      name: dso.name,
      age: dso.age
    };
  }

  static factorEiFromDso(dso: any): IEi {
    return {
      selectItems: dso.selectItems
    };
  }
}

const ems = new AlphaEmsService();

class AlphaEmsApi extends AlphaEmsBaseApi<IHead, IBody, IEi> {
  constructor(
    ems: AlphaEmsService) {
    super(ems, 'AlphaEmApi', 'https://AlphaEm',
      Factory.factorHeadFromDso,
      Factory.factorBodyFromDso,
      Factory.factorEiFromDso);
  }
}

class EmsForm
  extends AlphaEmsBaseFormModel<IHead, IBody, IEi>
{
  invalid = false;

  populateForRead(body: IBody): void {
    // nop
  }

  populateForNew(ei: IEi): void {
    // nop
  }

  populateForEdit(ei: IEi, body: IBody): void {
    // nop
  }

  createEntity(): Observable<IBody> {
    return this.api.baseCreate({
      id: 'newId',
      name: 'newName',
      age: 0
    });
  }

  updateEntity(): Observable<IBody> {
    return this.api.baseUpdate({
      id: 'updatedId',
      name: 'updatedName',
      age: 2
    });
  }
}

class EmsComponent
  extends AlphaEmsBaseComponent<IHead, IBody, IEi> {

  fm: EmsForm | undefined;
  error = {};

  setFi(fi: AlphaEmsFormInput<IBody>) {
    this.loadForm(fi).subscribe({
      next: emsFm => this.fm = emsFm as EmsForm,
      error: e => this.error = e
    });
  }

  constructor(
    api: AlphaEmsBaseApi<IHead, IBody, IEi>) {
    super(api, () => new EmsForm(),
      false);
    this.verbose = true;
  }

  onSave(): Observable<AlphaEmsFormResult<IBody>> {
    return this.save(this.fm!);
  }

  onDelete(): Observable<AlphaEmsFormResult<IBody>> {
    return this.delete();
  }

}

describe('AlphaEmsBaseComponent', () => {
  let mockHttpClient = {} as unknown as HttpClient;

  it('should create an instance', () => {
    ems.init(mockHttpClient);
    const api = new AlphaEmsApi(ems);
    const emsComp = new EmsComponent(api);
    expect(emsComp).toBeTruthy();
  });

  describe('loadForm for read', () => {

    it('should load form in read mode passing a valid body', () => {
      ems.init(mockHttpClient);
      const api = new AlphaEmsApi(ems);
      const emsComp = new EmsComponent(api);
      const body: IBody = {id: '1', name: 'one', age: 1};
      const fi = AlphaEmsFormInput.factorForRead(
        [body.id], undefined, undefined, body);
      emsComp.setFi(fi);
      expect(emsComp.fm).toBeDefined();
      const fm = emsComp.fm!;
      expect(fm.api).toEqual(api);
      expect(fm.fi).toEqual(fi);
      expect(fm.body).toEqual(body);
      expect(fm.ei).toBeUndefined();
    });

    it('should load form in read mode w/o passing a valid body', () => {
      const body = {id: '1', name: 'one', age: 1};
      const dso: IAlphaHttpObjectResultDso = {
        statusCode: 'O',
        mutationCode: 'N',
        notifications: [],
        hasMoreResults: false,
        data: body
      };
      const httpClient = {
        post: jest.fn(() => of(dso))
      } as unknown as HttpClient;
      ems.init(httpClient);
      const api = new AlphaEmsApi(ems);
      const emsComp = new EmsComponent(api);
      const fi = AlphaEmsFormInput
        .factorForRead<IBody>(['1']);
      emsComp.setFi(fi);
      expect(emsComp.fm).toBeDefined();
      const fm = emsComp.fm!;
      expect(fm.api).toEqual(api);
      expect(fm.fi).toEqual(fi);
      expect(fm.body).toEqual(body);
      expect(fm.ei).toBeUndefined();

      emsComp.onSave().subscribe(
        res => {
          expect(res.action).toEqual('R');
        }
      );

    });

    it('should load form in read mode handling an httpError', () => {
      const httpClient = {
        post: jest.fn(() =>
          throwError(() => 'someError'))
      } as unknown as HttpClient;
      ems.init(httpClient);
      const api = new AlphaEmsApi(ems);
      const emsComp = new EmsComponent(api);
      const fi = AlphaEmsFormInput
        .factorForRead<IBody>(['1']);
      emsComp.setFi(fi);
      expect(emsComp.fm).toBeUndefined();
      expect(emsComp.error).toEqual('someError');
    });

  });

  describe('loadForm for new', () => {

    it('should load the form for new with success', () => {
      const ei = {selectItems: ['item1', 'item2']};
      const dso: IAlphaHttpObjectResultDso = {
        statusCode: 'O',
        mutationCode: 'N',
        notifications: [],
        hasMoreResults: false,
        data: ei
      };
      const httpClient = {
        post: jest.fn(() => of(dso))
      } as unknown as HttpClient;
      ems.init(httpClient);
      const api = new AlphaEmsApi(ems);
      const emsComp = new EmsComponent(api);
      const fi = AlphaEmsFormInput
        .factorForNew<IBody>();
      emsComp.setFi(fi);
      expect(emsComp.fm).toBeDefined();
      const fm = emsComp.fm!;
      expect(fm.api).toEqual(api);
      expect(fm.fi).toEqual(fi);
      expect(fm.body).toBeUndefined();
      expect(fm.ei).toEqual(ei);

      // should save with success
      emsComp.onSave().subscribe(
        res => {
          expect(res.action).toEqual('C');
          expect(res.data).toBeDefined();
        });

      // simulate an error while saving
      httpClient.post = jest.fn(() =>
        throwError(() => 'someError'));
      emsComp.onSave().subscribe({
        error: e => expect(e).toEqual("someError")
      });

    });

    it('should load form in new mode handling an httpError', () => {
      const httpClient = {
        post: jest.fn(() =>
          throwError(() => 'someError'))
      } as unknown as HttpClient;
      ems.init(httpClient);
      const api = new AlphaEmsApi(ems);
      const emsComp = new EmsComponent(api);
      const fi = AlphaEmsFormInput
        .factorForNew<IBody>();
      emsComp.setFi(fi);
      expect(emsComp.fm).toBeUndefined();
      expect(emsComp.error).toEqual('someError');
    });

  });

  describe('loadForm for edit', () => {

    it('should load form in edit mode with success', () => {
      const ei = {selectItems: ['item1', 'item2']};
      const body = {id: '1', name: 'one', age: 1};
      const ec = {ei: ei, body: body};
      const dso: IAlphaHttpObjectResultDso = {
        statusCode: 'O',
        mutationCode: 'N',
        notifications: [],
        hasMoreResults: false,
        data: ec
      };
      const httpClient = {
        post: jest.fn(() => of(dso))
      } as unknown as HttpClient;
      ems.init(httpClient);
      const api = new AlphaEmsApi(ems);
      const emsComp = new EmsComponent(api);
      const fi = AlphaEmsFormInput
        .factorForEdit<IBody>(['1']);
      emsComp.setFi(fi);
      expect(emsComp.fm).toBeDefined();
      const fm = emsComp.fm!;
      expect(fm.api).toEqual(api);
      expect(fm.fi).toEqual(fi);
      expect(fm.body).toEqual(body);
      expect(fm.ei).toEqual(ei);

      // should save with success
      emsComp.onSave().subscribe({
        next: res => {
          expect(res.action).toEqual('U');
          expect(res.data).toBeDefined();
        }
      });

      // should soft-delete with success
      emsComp.onDelete().subscribe({
        next: res => {
          expect(res.action).toEqual('U');
          expect(res.data).toBeDefined();
        }
      });

      // should delete handling an httpError
      httpClient.post = jest.fn(() =>
        throwError(() => 'someError'));
      emsComp.onDelete().subscribe({
        error: e => expect(e).toEqual('someError')
      });
    });

    it('should load form in edit mode handling an httpError', () => {
      const httpClient = {
        post: jest.fn(() =>
          throwError(() => 'someError'))
      } as unknown as HttpClient;
      ems.init(httpClient);
      const api = new AlphaEmsApi(ems);
      const emsComp = new EmsComponent(api);
      const fi = AlphaEmsFormInput
        .factorForEdit<IBody>(['1']);
      emsComp.setFi(fi);
      expect(emsComp.fm).toBeUndefined();
      expect(emsComp.error).toEqual('someError');
    });

  });

});
