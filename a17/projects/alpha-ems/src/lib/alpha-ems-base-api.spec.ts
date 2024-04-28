import {
  IAlphaHttpListResultDso, IAlphaHttpObjectResultDso,
  IAlphaLocalBusService,
  IAlphaLoggerService,
  IAlphaOAuthService
} from "@pvway/alpha-common";
import {AlphaEmsBaseApi} from "./alpha-ems-base-api";
import {HttpClient } from "@angular/common/http";
import {Observable, of, throwError} from "rxjs";
import {AlphaEmsBaseApiEvent} from "./alpha-ems-base-api-event";

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
  constructor(ls: IAlphaLoggerService,
              oas: IAlphaOAuthService,
              lbs: IAlphaLocalBusService,
              httpClient: HttpClient) {
    super(ls, oas, lbs, httpClient,
      'AlphaEmApi', 'https://AlphaEm',
      Factory.factorHeadFromDso,
      Factory.factorBodyFromDso,
      Factory.factorEiFromDso);
  }

}

describe('AlphaEmsBaseApi', () => {

  const ls = {
    postErrorLog: jest.fn()
  } as unknown as IAlphaLoggerService;
  const oas = {
    authorize: jest.fn(
      (req: Observable<any>) => req)
  } as unknown as IAlphaOAuthService;
  const lbs = {
    publish: jest.fn()
  } as unknown as IAlphaLocalBusService;

  let mockHttpClient = {} as unknown as HttpClient;

  it('should create an instance', () => {
    const emsApi = new AlphaEmsApi(
      ls, oas, lbs, {} as unknown as HttpClient);
    expect(emsApi).toBeTruthy();
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
        post: jest.fn().mockImplementation(() => of(dso))
      } as unknown as HttpClient;
      const emsApi = new AlphaEmsApi(
        ls, oas, lbs, mockHttpClient);
      emsApi.list(true, 0, 10)
        .subscribe({
          next: heads => expect(heads.length).toEqual(2)
        });
    });

    it('should list heads handling error ', () => {
      mockHttpClient = {
        post: jest.fn().mockImplementation(() =>
          throwError(() => 'someError'))
      } as unknown as HttpClient;
      const emsApi = new AlphaEmsApi(
        ls, oas, lbs, mockHttpClient);
      emsApi.list(true, 0, 10)
        .subscribe({
          error: e => {
            expect(e).toEqual('someError');
            expect(ls.postErrorLog).toHaveBeenCalled();
          }
        });
    });

  });

  describe('getBody', () => {

    it('should getBody with success', () => {
      const body: IBody = {id: '1', name: '1', age: 1};
      const dso: IAlphaHttpObjectResultDso = {
        statusCode: 'O',
        mutationCode: 'N',
        notifications: [],
        hasMoreResults: false,
        data: body
      };
      mockHttpClient = {
        post: jest.fn().mockImplementation(() => of(dso))
      } as unknown as HttpClient;
      const emsApi = new AlphaEmsApi(
        ls, oas, lbs, mockHttpClient);
      emsApi.getBody(true, ['1'])
        .subscribe({
          next: body => {
            expect(body.id).toEqual('1');
            expect(body.name).toEqual(('name'));
            expect(body.age).toEqual(1);
          }
        });
    });

    it('should getBody with error', () => {
      mockHttpClient = {
        post: jest.fn().mockImplementation(
          () => throwError(() => 'someError'))
      } as unknown as HttpClient;
      const emsApi = new AlphaEmsApi(
        ls, oas, lbs, mockHttpClient);
      emsApi.getBody(true, ['1'])
        .subscribe({
          error: e => {
            expect(e).toEqual('someError');
            expect(ls.postErrorLog).toHaveBeenCalled();
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
        post: jest.fn().mockImplementation(() => of(dso))
      } as unknown as HttpClient;
      const emsApi = new AlphaEmsApi(
        ls, oas, lbs, mockHttpClient);
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
        post: jest.fn().mockImplementation(
          () => throwError(() => 'someError'))
      } as unknown as HttpClient;
      const emsApi = new AlphaEmsApi(
        ls, oas, lbs, mockHttpClient);
      emsApi.getBodyFe(['1'])
        .subscribe({
          error: e => {
            expect(e).toEqual('someError');
            expect(ls.postErrorLog).toHaveBeenCalled();
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
        post: jest.fn().mockImplementation(() => of(dso))
      } as unknown as HttpClient;
      const emsApi = new AlphaEmsApi(
        ls, oas, lbs, mockHttpClient);
      emsApi.getEi()
        .subscribe({
          next: ei => {
            expect(ei).toEqual(ei);
          }
        });
    });

    it('should getEi with error', () => {
      mockHttpClient = {
        post: jest.fn().mockImplementation(
          () => throwError(() => 'someError'))
      } as unknown as HttpClient;
      const emsApi = new AlphaEmsApi(
        ls, oas, lbs, mockHttpClient);
      emsApi.getEi()
        .subscribe({
          error: e => {
            expect(e).toEqual('someError');
            expect(ls.postErrorLog).toHaveBeenCalled();
          }
        });
    });
  });

  describe(('baseCreate'), () => {

    it('should create with success', () => {
      const body: IBody = {id: '1', name: '1', age: 1};
      const dso: IAlphaHttpObjectResultDso = {
        statusCode: 'O',
        mutationCode: 'N',
        notifications: [],
        hasMoreResults: false,
        data: body
      };
      mockHttpClient = {
        post: jest.fn().mockImplementation(() => of(dso))
      } as unknown as HttpClient;
      const emsApi = new AlphaEmsApi(
        ls, oas, lbs, mockHttpClient);
      const event = new AlphaEmsBaseApiEvent(
        'create', body);
      emsApi.baseCreate({})
        .subscribe({
          next: body => {
            expect(body.id).toEqual('1');
            expect(body.name).toEqual(('name'));
            expect(body.age).toEqual(1);
            expect(lbs.publish).toHaveBeenCalledWith(event);
          }
        });
    });

    it('should create with error', () => {
      mockHttpClient = {
        post: jest.fn().mockImplementation(() =>
          throwError(() => 'someError'))
      } as unknown as HttpClient;
      const emsApi = new AlphaEmsApi(
        ls, oas, lbs, mockHttpClient);
      emsApi.baseCreate({})
        .subscribe({
          error: e => {
            expect(e).toEqual('someError');
            expect(ls.postErrorLog).toHaveBeenCalled();
            expect(lbs.publish).not.toHaveBeenCalled();
          }
        });
    });

  });

  describe(('baseUpdate'), () => {

    it('should update with success', () => {
      const body: IBody = {id: '1', name: '1', age: 1};
      const dso: IAlphaHttpObjectResultDso = {
        statusCode: 'O',
        mutationCode: 'N',
        notifications: [],
        hasMoreResults: false,
        data: body
      };
      mockHttpClient = {
        post: jest.fn().mockImplementation(() => of(dso))
      } as unknown as HttpClient;
      const emsApi = new AlphaEmsApi(
        ls, oas, lbs, mockHttpClient);
      const event = new AlphaEmsBaseApiEvent(
        'update', body);
      emsApi.baseUpdate(body)
        .subscribe({
          next: body => {
            expect(body.id).toEqual('1');
            expect(body.name).toEqual(('name'));
            expect(body.age).toEqual(1);
            expect(lbs.publish).toHaveBeenCalledWith(event);
          }
        });
    });

    it('should create with error', () => {
      const body: IBody = {id: '1', name: '1', age: 1};
      mockHttpClient = {
        post: jest.fn().mockImplementation(() =>
          throwError(() => 'someError'))
      } as unknown as HttpClient;
      const emsApi = new AlphaEmsApi(
        ls, oas, lbs, mockHttpClient);
      emsApi.baseUpdate(body)
        .subscribe({
          error: e => {
            expect(e).toEqual('someError');
            expect(ls.postErrorLog).toHaveBeenCalled();
            expect(lbs.publish).not.toHaveBeenCalled();
          }
        });
    });

  });

  describe(('delete'), () => {

    it('should hard delete with success', () => {
      const body: IBody = {id: '1', name: '1', age: 1};
      const dso: IAlphaHttpObjectResultDso = {
        statusCode: 'O',
        mutationCode: 'N',
        notifications: [],
        hasMoreResults: false,
        data: undefined
      };
      mockHttpClient = {
        post: jest.fn().mockImplementation(() => of(dso))
      } as unknown as HttpClient;
      const emsApi = new AlphaEmsApi(
        ls, oas, lbs, mockHttpClient);
      const event = new AlphaEmsBaseApiEvent(
        'delete', body);
      emsApi.delete(['1'])
        .subscribe({
          next: body => {
            expect(body).toBeUndefined();
            expect(lbs.publish).toHaveBeenCalledWith(event);
          }
        });
    });

    it('should soft delete with success', () => {
      const body: IBody = {id: '1', name: '1', age: 1};
      const dso: IAlphaHttpObjectResultDso = {
        statusCode: 'O',
        mutationCode: 'N',
        notifications: [],
        hasMoreResults: false,
        data: body
      };
      mockHttpClient = {
        post: jest.fn().mockImplementation(() => of(dso))
      } as unknown as HttpClient;
      const emsApi = new AlphaEmsApi(
        ls, oas, lbs, mockHttpClient);
      const event = new AlphaEmsBaseApiEvent(
        'update', body);
      emsApi.delete(['1'])
        .subscribe({
          next: body => {
            expect(body).toBeDefined();
            expect(body!.id).toEqual('1');
            expect(body!.name).toEqual(('name'));
            expect(body!.age).toEqual(1);
            expect(lbs.publish).toHaveBeenCalledWith(event);
          }
        });
    });

    it('should delete with error', () => {
      mockHttpClient = {
        post: jest.fn().mockImplementation(() =>
          throwError(() => 'someError'))
      } as unknown as HttpClient;
      const emsApi = new AlphaEmsApi(
        ls, oas, lbs, mockHttpClient);
      emsApi.delete(['1'])
        .subscribe({
          error: e => {
            expect(e).toEqual('someError');
            expect(ls.postErrorLog).toHaveBeenCalled();
            expect(lbs.publish).not.toHaveBeenCalled();
          }
        });
    });

  });

});
