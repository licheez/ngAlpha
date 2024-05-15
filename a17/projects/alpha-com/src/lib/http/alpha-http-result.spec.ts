import {AlphaHttpListResult, AlphaHttpObjectResult, AlphaHttpResult} from "./alpha-http-result";
import {AlphaSeverityEnum} from "./alpha-severity-enum";
import {expect} from "@jest/globals";

describe('AlphaResult', () => {
  it('should factor an AlphaHttpResult', () => {
    const dso = {
      statusCode: 'O',
      mutationCode: 'N',
      notifications: [{
        severityCode: 'W',
        message: 'someWarning'
      }],
      hasMoreResults: false
    };
    expect(AlphaHttpObjectResult.isBaseResult(dso)).toBeTruthy();
    const r = AlphaHttpResult.factorFromDso(dso);
    expect(r).toBeInstanceOf(AlphaHttpResult);
    expect(r.success).toBeTruthy();
    expect(r.failure).toBeFalsy();
    expect(r.message).toEqual('someWarning');

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

    const dso = {
      statusCode: 'O',
      mutationCode: 'N',
      notifications: [{
        severityCode: 'W',
        message: 'aWarning'
      }],
      hasMoreResults: false,
      data: dataDso
    };

    expect(AlphaHttpObjectResult.isObjectResult(dso)).toBeTruthy();

    const r = AlphaHttpObjectResult.factorFromDso(dso, factor);

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

    const dso = {
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
    };

    expect(AlphaHttpObjectResult.isListResult(dso)).toBeTruthy();

    const r = AlphaHttpListResult.factorFromDso(dso, factor);

    expect(r).toBeInstanceOf(AlphaHttpListResult);
    expect(r.status).toEqual(AlphaSeverityEnum.Warning);
    expect(r.hasMoreResults).toBeTruthy();
    expect(r.notifications.length).toEqual(2);
    expect(r.notifications[0].severity).toEqual(AlphaSeverityEnum.Warning);
    expect(r.notifications[0].message).toEqual('warningOne');
    expect(r.data).toBeDefined();
    expect(r.data.length).toEqual(2);
    expect(r.message).toEqual('warningOne, warningTwo');

  });

  describe('instance check', () => {
    it('should recognize a baseResult vs an any vs a string', () => {

      const dso = {
        statusCode: 'O',
        mutationCode: 'N',
        notifications: [{
          severityCode: 'W',
          message: 'someWarning'
        }],
        hasMoreResults: false
      };
      expect(AlphaHttpResult.isBaseResult(dso)).toBeTruthy();

      expect(AlphaHttpResult.isObjectResult({})).toBeFalsy();

      expect(AlphaHttpResult.isBaseResult('a string')).toBeFalsy();
    });

    it ('should recognize an objectResult', () => {
      const dsoList = {
        statusCode: 'O',
        mutationCode: 'N',
        notifications: [{
          severityCode: 'W',
          message: 'someWarning'
        }],
        hasMoreResults: false,
        data: []
      };
      const dsoObject = {
        statusCode: 'O',
        mutationCode: 'N',
        notifications: [{
          severityCode: 'W',
          message: 'someWarning'
        }],
        hasMoreResults: false,
        data: 'someInfo'
      };

      expect(AlphaHttpResult.isObjectResult('a string')).toBeFalsy();
      expect(AlphaHttpResult.isObjectResult({})).toBeFalsy();
      expect(AlphaHttpResult.isObjectResult(dsoObject)).toBeTruthy();
      expect(AlphaHttpResult.isObjectResult(dsoList)).toBeFalsy();
    });
  });

  it ('should recognize a listResult', () => {
    const dsoList = {
      statusCode: 'O',
      mutationCode: 'N',
      notifications: [{
        severityCode: 'W',
        message: 'someWarning'
      }],
      hasMoreResults: false,
      data: []
    };
    const dsoObject = {
      statusCode: 'O',
      mutationCode: 'N',
      notifications: [{
        severityCode: 'W',
        message: 'someWarning'
      }],
      hasMoreResults: false,
      data: 'someInfo'
    };

    expect(AlphaHttpResult.isListResult('a string')).toBeFalsy();
    expect(AlphaHttpResult.isListResult({})).toBeFalsy();
    expect(AlphaHttpResult.isListResult(dsoObject)).toBeFalsy();
    expect(AlphaHttpResult.isListResult(dsoList)).toBeTruthy();
  });

});
