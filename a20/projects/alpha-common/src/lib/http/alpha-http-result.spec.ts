import {
  AlphaHttpResult,
  AlphaHttpObjectResult,
  AlphaHttpListResult,
  IAlphaHttpResultDso,
  IAlphaHttpObjectResultDso,
  IAlphaHttpListResultDso
} from './alpha-http-result';
import { AlphaSeverityEnum } from './alpha-severity-enum';
import { AlphaMutationEnum } from './alpha-mutation-enum';

describe('AlphaHttpResult', () => {
  it('should map DSO to AlphaHttpResult correctly', () => {
    const dso: IAlphaHttpResultDso = {
      statusCode: 'E',
      mutationCode: 'C',
      notifications: [
        { message: 'Error occurred', severityCode: 'E' },
        { message: 'Another error', severityCode: 'E' }
      ],
      hasMoreResults: false
    };
    const result = AlphaHttpResult.factorFromDso(dso);
    expect(result.status).toBe(AlphaSeverityEnum.Error);
    expect(result.mutation).toBe(AlphaMutationEnum.Create);
    expect(result.notifications.length).toBe(2);
    expect(result.hasMoreResults).toBe(false);
    expect(result.failure).toBe(true);
    expect(result.success).toBe(false);
    expect(result.message).toBe('Error occurred, Another error');
  });

  it('should handle empty notifications', () => {
    const dso: IAlphaHttpResultDso = {
      statusCode: 'O',
      mutationCode: 'N',
      notifications: [],
      hasMoreResults: true
    };
    const result = AlphaHttpResult.factorFromDso(dso);
    expect(result.notifications.length).toBe(0);
    expect(result.message).toBe('');
    expect(result.success).toBe(true);
    expect(result.failure).toBe(false);
  });

  it('isBaseResult should validate correct DSO', () => {
    const dso: IAlphaHttpResultDso = {
      statusCode: 'O',
      mutationCode: 'N',
      notifications: [],
      hasMoreResults: true
    };
    expect(AlphaHttpResult.isBaseResult(dso)).toBe(true);
    expect(AlphaHttpResult.isBaseResult({})).toBe(false);
    expect(AlphaHttpResult.isBaseResult(null)).toBe(false);
    expect(AlphaHttpResult.isBaseResult(undefined)).toBe(false);
    expect(AlphaHttpResult.isBaseResult('string')).toBe(false);
  });
});

describe('AlphaHttpObjectResult', () => {
  it('should map DSO to AlphaHttpObjectResult with data', () => {
    const dso: IAlphaHttpObjectResultDso = {
      statusCode: 'I',
      mutationCode: 'U',
      notifications: [
        { message: 'Info', severityCode: 'I' }
      ],
      hasMoreResults: false,
      data: { id: 1, name: 'Test' }
    };
    const result = AlphaHttpObjectResult.factorFromDso(dso);
    expect(result.status).toBe(AlphaSeverityEnum.Info);
    expect(result.mutation).toBe(AlphaMutationEnum.Update);
    expect(result.data).toEqual({ id: 1, name: 'Test' });
    expect(result.notifications.length).toBe(1);
    expect(result.message).toBe('Info');
  });

  it('should handle null data', () => {
    const dso: IAlphaHttpObjectResultDso = {
      statusCode: 'O',
      mutationCode: 'N',
      notifications: [],
      hasMoreResults: false,
      data: null
    };
    const result = AlphaHttpObjectResult.factorFromDso(dso);
    expect(result.data).toBeNull();
  });

  it('isObjectResult should validate correct DSO', () => {
    const dso: IAlphaHttpObjectResultDso = {
      statusCode: 'O',
      mutationCode: 'N',
      notifications: [],
      hasMoreResults: false,
      data: { foo: 'bar' }
    };
    expect(AlphaHttpResult.isObjectResult(dso)).toBe(true);
    expect(AlphaHttpResult.isObjectResult({ data: [] })).toBe(false);
  });
});

describe('AlphaHttpListResult', () => {
  it('should map DSO to AlphaHttpListResult with array data', () => {
    const dso: IAlphaHttpListResultDso = {
      statusCode: 'W',
      mutationCode: 'D',
      notifications: [
        { message: 'Warning', severityCode: 'W' }
      ],
      hasMoreResults: true,
      data: [ { id: 1 }, { id: 2 } ]
    };
    const result = AlphaHttpListResult.factorFromDso(dso);
    expect(result.status).toBe(AlphaSeverityEnum.Warning);
    expect(result.mutation).toBe(AlphaMutationEnum.Deactivate);
    expect(result.data).toEqual([ { id: 1 }, { id: 2 } ]);
    expect(result.notifications.length).toBe(1);
    expect(result.message).toBe('Warning');
    expect(result.hasMoreResults).toBe(true);
  });

  it('should handle empty array data', () => {
    const dso: IAlphaHttpListResultDso = {
      statusCode: 'O',
      mutationCode: 'N',
      notifications: [],
      hasMoreResults: false,
      data: []
    };
    const result = AlphaHttpListResult.factorFromDso(dso);
    expect(result.data).toEqual([]);
  });

  it('isListResult should validate correct DSO', () => {
    const dso: IAlphaHttpListResultDso = {
      statusCode: 'O',
      mutationCode: 'N',
      notifications: [],
      hasMoreResults: false,
      data: []
    };
    expect(AlphaHttpResult.isListResult(dso)).toBe(true);
    expect(AlphaHttpResult.isListResult({ data: {} })).toBe(false);
  });
});

