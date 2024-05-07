import {HttpClient} from "@angular/common/http";
import {Observable, of, throwError} from "rxjs";
import {AlphaEmsUsoOptionSet, IAlphaHttpListResultDso, IAlphaHttpObjectResultDso} from "@pvway/alpha-common";

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
    post: (url: string, body: any) => {
      if (url === EmsCustomerHttpClient.ControllerUrl
        + '/list') {
        const usoList = body as AlphaEmsUsoOptionSet;
        const skip = Number(usoList.pairs[0].value);
        const take = Number(usoList.pairs[1].value);
        const listReply = this.list(skip, take);
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

  list(skip: number, take: number): Observable<any> {
    const items = this.customers.slice(skip, skip + take);
    const res: IAlphaHttpListResultDso = {
      statusCode: 'O',
      mutationCode: 'N',
      notifications: [],
      hasMoreResults: true,
      data: items
    }
    return of(res);
  }

  body(id: string): Observable<any> {
    const body = this.customers.find(
      x => x.id === id);
    const res: IAlphaHttpObjectResultDso = {
      statusCode: 'O',
      mutationCode: 'N',
      notifications: [],
      hasMoreResults: true,
      data: body
    }
    return of(res);
  }

  ei(): Observable<any> {
    const ei = {
      countryHeads: this.countryHeads
    };
    const res: IAlphaHttpObjectResultDso = {
      statusCode: 'O',
      mutationCode: 'N',
      notifications: [],
      hasMoreResults: true,
      data: ei
    };
    return of(res);
  }

  bodyFe(id: string): Observable<any> {
    const body = this.customers.find(
      x => x.id === id);
    const ei = {
      countryHeads: this.countryHeads
    };
    const ec = {
      body: body,
      ei: ei
    };
    const res: IAlphaHttpObjectResultDso = {
      statusCode: 'O',
      mutationCode: 'N',
      notifications: [],
      hasMoreResults: true,
      data: ec
    };
    return of(res);
  }

  create(uso: any): Observable<any> {
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
    return of(body);
  }

  update(uso: any): Observable<any> {
    const body = this.customers.find(
      x => x.id === uso.id)!;
    const countryHead = this.countryHeads.find(
      c => c.iso === uso.countryIso);
    body.name = uso.name;
    body.address = uso.address;
    body.countryHead = countryHead!;
    return of(body);
  }

  delete(id: string): Observable<any> {
    const index = this.customers
      .findIndex(x => x.id === id);
    if (index !== -1) {
      this.customers.splice(index, 1);
    }
    return of(null);
  }

}
