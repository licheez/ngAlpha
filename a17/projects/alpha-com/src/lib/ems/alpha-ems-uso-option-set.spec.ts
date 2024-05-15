import { AlphaEmsUsoOptionSet } from './alpha-ems-uso-option-set';

describe('AlphaEmsUsoOptions', () => {

  const options =
    new Map<string, string>([
      ['p1k', 'p1v'],
      ['p2k', 'p2v']
    ]);

  it('should create an instance', () => {
    const optionSet = new AlphaEmsUsoOptionSet(
      ['k1', 'k2'], options);
    expect(optionSet).toBeTruthy();
    expect(optionSet.keys.length).toEqual(2);
    expect(optionSet.pairs.length).toEqual(2);
  });
});
