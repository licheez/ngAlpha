import {HttpClient} from "@angular/common/http";
import {Observable, of, throwError} from "rxjs";
import {
  AlphaEmsUsoOptionSet,
  AlphaUtils,
  IAlphaHttpListResultDso,
  IAlphaHttpObjectResultDso
} from "@pvway/alpha-common";

export class EmsCustomerHttpClient {

  static readonly ControllerUrl = "https://myWebApiServer/customer";

  countryHeads = [
    {iso: 'BE', name: 'Belgium'},
    {iso: 'FR', name: 'France'}
  ];

  customers = [
    {id: '1', name: 'one', address: 'addressOne', countryHead: {iso: 'BE', name: 'Belgium'}}
  ];

  httpClient = {
    post: (url: string, body: any): Observable<any> => {
      if (url === EmsCustomerHttpClient.ControllerUrl
        + '/list') {
        const usoList = body as AlphaEmsUsoOptionSet;
        const term = usoList.pairs[0].value;
        const skip = Number(usoList.pairs[1].value);
        const take = Number(usoList.pairs[2].value);
        const listReply =
          this.list(skip, take, term);
        return of(listReply);
      } else if (url === EmsCustomerHttpClient.ControllerUrl
        + '/body') {
        const usoBody = body as AlphaEmsUsoOptionSet;
        const bodyReply = this.body(usoBody.keys[0]);
        return of(bodyReply);
      } else if (url === EmsCustomerHttpClient.ControllerUrl
        + '/bodyFe') {
        const usoBodyFe = body as AlphaEmsUsoOptionSet;
        const bodyFeReply = this.bodyFe(usoBodyFe.keys[0]);
        return of(bodyFeReply);
      } else if (url === EmsCustomerHttpClient.ControllerUrl
        + '/ei') {
        const eiReply = this.ei();
        return of(eiReply);
      } else if (url === EmsCustomerHttpClient.ControllerUrl
        + '/create') {
        const createReply = this.create(body);
        return of(createReply)
      } else if (url === EmsCustomerHttpClient.ControllerUrl
        + '/update') {
        const updateReply = this.update(body);
        return of (updateReply);
      } else if (url === EmsCustomerHttpClient.ControllerUrl
        + '/delete') {
        const usoDelete = body as AlphaEmsUsoOptionSet;
        const deleteReply = this.delete(usoDelete.keys[0]);
        return of(deleteReply);
      }
      return throwError(() => '404');
    }
  } as unknown as HttpClient;

  list(skip: number, take: number, term?: string):
    IAlphaHttpListResultDso {
    const fItems = term
      ? this.customers.filter(item =>
        AlphaUtils.contains(item.name, term))
      : this.customers;
    const sItems = fItems.sort(
      (a : any, b: any) => {
        if (a.name === b.name){
          return 0
        } else return (a.name < b.name)
          ? -1 : 1
      });
    const items =
      sItems.slice(skip, skip + take);
    return {
      statusCode: 'O',
      mutationCode: 'N',
      notifications: [],
      hasMoreResults: true,
      data: items
    };
  }

  body(id: string): IAlphaHttpObjectResultDso {
    const body = this.customers.find(
      x => x.id === id);
    return {
      statusCode: 'O',
      mutationCode: 'N',
      notifications: [],
      hasMoreResults: true,
      data: body
    };
  }

  ei(): IAlphaHttpObjectResultDso {
    const ei = {
      countryHeads: this.countryHeads
    };
    return {
      statusCode: 'O',
      mutationCode: 'N',
      notifications: [],
      hasMoreResults: true,
      data: ei
    };
  }

  bodyFe(id: string): IAlphaHttpObjectResultDso {
    const body = this.customers.find(
      x => x.id === id);
    const ei = {
      countryHeads: this.countryHeads
    };
    const ec = {
      body: body,
      ei: ei
    };
    return {
      statusCode: 'O',
      mutationCode: 'N',
      notifications: [],
      hasMoreResults: true,
      data: ec
    };
  }

  create(uso: any): IAlphaHttpObjectResultDso {
    const countryHead = this.countryHeads.find(
      c => c.iso === uso.countryIso);

    let maxId = -1;
    this.customers.forEach(
      c => {
        const cId = Number(c.id);
        if (cId > maxId) {
          maxId = cId;
        }
      });
    const newId = maxId + 1;
    const body = {
      id: newId.toString(),
      name: uso.name,
      address: uso.address,
      countryHead: countryHead!
    };
    this.customers.push(body);
    return {
      statusCode: 'C',
      mutationCode: 'N',
      notifications: [],
      hasMoreResults: true,
      data: body
    };
  }

  update(uso: any): IAlphaHttpObjectResultDso {
    const body = this.customers.find(
      x => x.id === uso.id)!;
    const countryHead = this.countryHeads.find(
      c => c.iso === uso.countryIso);
    body.name = uso.name;
    body.address = uso.address;
    body.countryHead = countryHead!;
    return {
      statusCode: 'U',
      mutationCode: 'N',
      notifications: [],
      hasMoreResults: true,
      data: body
    };
  }

  delete(id: string): IAlphaHttpObjectResultDso {
    const index = this.customers
      .findIndex(x => x.id === id);
    if (index !== -1) {
      this.customers.splice(index, 1);
    }
    return {
      statusCode: 'D',
      mutationCode: 'N',
      notifications: [],
      hasMoreResults: true,
      data: null
    };

  }

}
