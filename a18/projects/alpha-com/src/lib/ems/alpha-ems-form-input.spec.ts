import { AlphaEmsFormInput } from './alpha-ems-form-input';

interface IHead {
  id: string,
  name: string
}

interface IBody extends IHead {
  age: number
}

describe('AlphaEmsFormInput', () => {

  const keys = ['1'];
  const body: IBody = {
    id: '1',
    name: 'one',
    age: 1
  };
  const params = {
    p1: 'p1',
    p2: 'p2'
  };
  const options =
    new Map<string, string>([
      ['k1','v1'], ['k2','v2']]);

  it('should create an instance for read', () => {

    const fi = AlphaEmsFormInput
      .factorForRead<IBody>(
      keys, params, options, body);
    expect(fi).toBeTruthy();
    expect(fi.mode).toEqual('read');
    expect(fi.keys).toEqual(keys);
    expect(fi.params).toEqual(params);
    expect(fi.body).toEqual(body);
  });

  it('should create an instance for new', () => {

    const fi = AlphaEmsFormInput
      .factorForNew<IBody>(params, options);
    expect(fi).toBeTruthy();
    expect(fi.mode).toEqual('new');
    expect(fi.keys).toEqual([]);
    expect(fi.params).toEqual(params);
    expect(fi.body).toBeUndefined();
  });

  it('should create an instance for edit', () => {

    const fi = AlphaEmsFormInput
      .factorForEdit<IBody>(keys, params, options);
    expect(fi).toBeTruthy();
    expect(fi.mode).toEqual('edit');
    expect(fi.keys).toEqual(keys);
    expect(fi.params).toEqual(params);
    expect(fi.body).toBeUndefined();
  });

});
