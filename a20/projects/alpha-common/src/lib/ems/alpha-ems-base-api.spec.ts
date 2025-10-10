import {AlphaEmsService} from './alpha-ems.service';
import {AlphaEmsBaseApi} from './alpha-ems-base-api';
import {HttpClient} from '@angular/common/http';
import {IAlphaHttpListResultDso, IAlphaHttpObjectResultDso} from '../http/alpha-http-result';
import {of, throwError} from 'rxjs';

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

class AlphaEmsApi extends AlphaEmsBaseApi<IHead, IBody, IEi> {
  constructor(ems: AlphaEmsService) {
    super(
      ems,
      'AlphaEmApi', 'https://AlphaEm',
      Factory.factorHeadFromDso,
      Factory.factorBodyFromDso,
      Factory.factorEiFromDso);
  }

}

describe('AlphaEmsBaseApi', () => {

  const ems = new AlphaEmsService();
  let mockHttpClient = {} as unknown as HttpClient;

  it('should create an instance', (done) => {
    const emsApi = new AlphaEmsApi(
      ems);
    expect(emsApi).toBeTruthy();
    done();
  });

  describe('list', () => {

    it('should list heads with success', () => {
      const h1: IHead = {id: '1', name: '1'};
      const h2: IHead = {id: '1', name: '1'};
      const dso: IAlphaHttpListResultDso = {
        statusCode: 'O',
        mutationCode: 'N',
        notifications: [],
        hasMoreResults: false,
        data: [h1, h2]
      };
      mockHttpClient = {
        post: () => of(dso)
      } as unknown as HttpClient;
      ems.init(mockHttpClient);
      const emsApi = new AlphaEmsApi(ems);
      emsApi.list(true, 0, 10)
        .subscribe({
          next: heads => expect(heads.length).toEqual(2)
        });
    });

    it('should list heads handling error ', () => {
      mockHttpClient = {
        post: () =>
          throwError(() => 'someError')
      } as unknown as HttpClient;
      ems.init(mockHttpClient);
      const emsApi = new AlphaEmsApi(ems);
      emsApi.list(true, 0, 10)
        .subscribe({
          error: e => {
            expect(e).toEqual('someError');
          }
        });
    });

  });

  describe('getBody', () => {

    it('should getBody with success', () => {
      const body: IBody = {id: 'id', name: 'name', age: 1};
      const dso: IAlphaHttpObjectResultDso = {
        statusCode: 'O',
        mutationCode: 'N',
        notifications: [],
        hasMoreResults: false,
        data: body
      };
      mockHttpClient = {
        post: () => of(dso)
      } as unknown as HttpClient;
      ems.init(mockHttpClient);
      const emsApi = new AlphaEmsApi(ems);
      emsApi.getBody(true, ['1'])
        .subscribe({
          next: body => {
            expect(body.id).toEqual('id');
            expect(body.name).toEqual('name');
            expect(body.age).toEqual(1);
          }
        });
    });

    it('should getBody with error', () => {
      mockHttpClient = {
        post: () => throwError(
          () => 'someError')
      } as unknown as HttpClient;
      ems.init(mockHttpClient);
      const emsApi = new AlphaEmsApi(ems);
      emsApi.getBody(true, ['1'])
        .subscribe({
          error: e => {
            expect(e).toEqual('someError');
          }
        });
    });

  });

  describe('getBodyFe', () => {

    it('should getBodyFe with success', () => {
      const body: IBody = {id: '1', name: '1', age: 1};
      const ei: IEi = {selectItems: ['item1', 'item3']};
      const ec = {
        body: body,
        ei: ei
      }
      const dso: IAlphaHttpObjectResultDso = {
        statusCode: 'O',
        mutationCode: 'N',
        notifications: [],
        hasMoreResults: false,
        data: ec
      };
      mockHttpClient = {
        post: () => of(dso)
      } as unknown as HttpClient;
      ems.init(mockHttpClient);
      const emsApi = new AlphaEmsApi(ems);
      emsApi.getBodyFe(['1'])
        .subscribe({
          next: ec => {
            expect(ec.body).toEqual(body);
            expect(ec.ei).toEqual(ei);
          }
        });
    });

    it('should getBodyFe with error', () => {
      mockHttpClient = {
        post: () =>
          throwError(() => 'someError')
      } as unknown as HttpClient;
      ems.init(mockHttpClient);
      const emsApi = new AlphaEmsApi(ems);
      emsApi.getBodyFe(['1'])
        .subscribe({
          error: e => {
            expect(e).toEqual('someError');
          }
        });
    });

  });

  describe('getEi', () => {

    it('should getEi with success', () => {
      const ei: IEi = {selectItems: ['item1', 'item3']};
      const dso: IAlphaHttpObjectResultDso = {
        statusCode: 'O',
        mutationCode: 'N',
        notifications: [],
        hasMoreResults: false,
        data: ei
      };
      mockHttpClient = {
        post: () => of(dso)
      } as unknown as HttpClient;
      ems.init(mockHttpClient);
      const emsApi = new AlphaEmsApi(ems);
      emsApi.getEi()
        .subscribe({
          next: ei => {
            expect(ei).toEqual(ei);
          }
        });
    });

    it('should getEi with error', () => {
      mockHttpClient = {
        post: () =>
          throwError(() => 'someError')
      } as unknown as HttpClient;
      ems.init(mockHttpClient);
      const emsApi = new AlphaEmsApi(ems);
      emsApi.getEi()
        .subscribe({
          error: e => {
            expect(e).toEqual('someError');
          }
        });
    });
  });

  describe(('baseCreate'), () => {

    it('should create with success', () => {
      const body: IBody = {id: 'id', name: 'name', age: 1};
      const dso: IAlphaHttpObjectResultDso = {
        statusCode: 'O',
        mutationCode: 'N',
        notifications: [],
        hasMoreResults: false,
        data: body
      };
      mockHttpClient = {
        post: () => of(dso)
      } as unknown as HttpClient;
      ems.init(mockHttpClient);
      const emsApi = new AlphaEmsApi(ems);
      emsApi.baseCreate({})
        .subscribe({
          next: body => {
            expect(body.id).toEqual('id');
            expect(body.name).toEqual(('name'));
            expect(body.age).toEqual(1);
          }
        });
    });

    it('should create with error', () => {
      mockHttpClient = {
        post: () =>
          throwError(() => 'someError')
      } as unknown as HttpClient;
      ems.init(mockHttpClient);
      const emsApi = new AlphaEmsApi(ems);
      emsApi.baseCreate({})
        .subscribe({
          error: e => {
            expect(e).toEqual('someError');
          }
        });
    });

  });

  describe(('baseUpdate'), () => {

    it('should update with success', () => {
      const body: IBody = {id: 'id', name: 'name', age: 1};
      const dso: IAlphaHttpObjectResultDso = {
        statusCode: 'O',
        mutationCode: 'N',
        notifications: [],
        hasMoreResults: false,
        data: body
      };
      mockHttpClient = {
        post: () => of(dso)
      } as unknown as HttpClient;
      ems.init(mockHttpClient);
      const emsApi = new AlphaEmsApi(ems);
      emsApi.baseUpdate(body)
        .subscribe({
          next: body => {
            expect(body.id).toEqual('id');
            expect(body.name).toEqual(('name'));
            expect(body.age).toEqual(1);
          }
        });
    });

    it('should create with error', () => {
      const body: IBody = {id: '1', name: '1', age: 1};
      mockHttpClient = {
        post: () =>
          throwError(() => 'someError')
      } as unknown as HttpClient;
      ems.init(mockHttpClient);
      const emsApi = new AlphaEmsApi(ems);
      emsApi.baseUpdate(body)
        .subscribe({
          error: e => {
            expect(e).toEqual('someError');
          }
        });
    });

  });

  describe(('delete'), () => {

    it('should hard delete with success', () => {
      const dso: IAlphaHttpObjectResultDso = {
        statusCode: 'O',
        mutationCode: 'N',
        notifications: [],
        hasMoreResults: false,
        data: undefined
      };
      mockHttpClient = {
        post: () => of(dso)
      } as unknown as HttpClient;
      ems.init(mockHttpClient);
      const emsApi = new AlphaEmsApi(ems);
      emsApi.delete(['1'])
        .subscribe({
          next: body => {
            expect(body).toBeUndefined();
          }
        });
    });

    it('should soft delete with success', () => {
      const body: IBody = {id: 'id', name: 'name', age: 1};
      const dso: IAlphaHttpObjectResultDso = {
        statusCode: 'O',
        mutationCode: 'N',
        notifications: [],
        hasMoreResults: false,
        data: body
      };
      mockHttpClient = {
        post: () => of(dso)
      } as unknown as HttpClient;
      ems.init(mockHttpClient);
      const emsApi = new AlphaEmsApi(ems);
      emsApi.delete(['1'])
        .subscribe({
          next: body => {
            expect(body).toBeDefined();
            expect(body!.id).toEqual('id');
            expect(body!.name).toEqual(('name'));
            expect(body!.age).toEqual(1);
          }
        });
    });

    it('should delete with error', () => {
      mockHttpClient = {
        post: () =>
          throwError(() => 'someError')
      } as unknown as HttpClient;
      ems.init(mockHttpClient);
      const emsApi = new AlphaEmsApi(ems);
      emsApi.delete(['1'])
        .subscribe({
          error: e => {
            expect(e).toEqual('someError');
          }
        });
    });

  });


});

