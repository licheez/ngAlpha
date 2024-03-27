import {AlphaHttpListResult, AlphaHttpObjectResult, AlphaHttpResult} from "./alpha-http-result";
import {name} from "ci-info";
import {AlphaSeverityEnum} from "./alpha-severity-enum";

describe('AlphaResult', () => {
  it('should factor an AlphaHttpResult', () => {
    const r = AlphaHttpResult.factorFromDso({
      statusCode: 'O',
      mutationCode: 'N',
      notifications: [{
        severityCode: 'W',
        message: 'someWarning'
      }],
      hasMoreResults: false
    });
    expect(r).toBeInstanceOf(AlphaHttpResult);

    expect(true).toBeTruthy();
  });

  it('should factor an AlphaHttpObjectResult', () => {

    let dataDso = {
      id: 1,
      name: 'some'
    };

    const factor = (dso: any) => {
      return {
        id: dso.id + 1,
        name: dso.name + 'Name'
      }
    }

    const r = AlphaHttpObjectResult.factorFromDso({
      statusCode: 'O',
      mutationCode: 'N',
      notifications: [{
        severityCode: 'W',
        message: 'aWarning'
      }],
      hasMoreResults: false,
      data: dataDso
    }, factor);

    expect(r).toBeInstanceOf(AlphaHttpObjectResult);
    expect(r.status).toEqual(AlphaSeverityEnum.Ok);
    expect(r.hasMoreResults).toBeFalsy();
    expect(r.notifications.length).toEqual(1);
    expect(r.notifications[0].severity).toEqual(AlphaSeverityEnum.Warning);
    expect(r.notifications[0].message).toEqual('aWarning');
    expect(r.data).toBeDefined();
    expect(r.data.id).toEqual(2);
    expect(r.data.name).toEqual('someName');
  });

  it('should factor an AlphaHttpListResult', () => {

    let dataDso = [
      {id: 1, name: 'one'},
      {id: 2, name: 'two'}
    ];

    const factor = (dso: any) => {
      return {
        id: dso.id,
        name: dso.name
      }
    }

    const r = AlphaHttpListResult.factorFromDso({
      statusCode: 'W',
      mutationCode: 'N',
      notifications: [{
        severityCode: 'W',
        message: 'warningOne'
      }, {
        severityCode: 'W',
        message: 'warningTwo'
      }],
      hasMoreResults: true,
      data: dataDso
    }, factor);

    expect(r).toBeInstanceOf(AlphaHttpListResult);
    expect(r.status).toEqual(AlphaSeverityEnum.Warning);
    expect(r.hasMoreResults).toBeTruthy();
    expect(r.notifications.length).toEqual(2);
    expect(r.notifications[0].severity).toEqual(AlphaSeverityEnum.Warning);
    expect(r.notifications[0].message).toEqual('warningOne');
    expect(r.data).toBeDefined();
    expect(r.data.length).toEqual(2);

  });

});
