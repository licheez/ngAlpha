import { AlphaEmsFormResult } from './alpha-ems-form-result';

interface IHead {
  id: string,
  name: string
}

interface IBody extends IHead {
  age: number
}

describe('AlphaEmsFormResult', () => {

  const body: IBody = {
    id: '1',
    name: 'one',
    age: 1
  };

  it('should create an instance', () => {
    const r = new AlphaEmsFormResult('C', body);
    expect(r.action).toEqual('C');
    expect(r.data).toEqual(body);
  });
});
