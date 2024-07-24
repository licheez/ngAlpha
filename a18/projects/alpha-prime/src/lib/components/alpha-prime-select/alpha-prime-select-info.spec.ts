import {AlphaPrimeSelectInfo, IAlphaPrimeSelectOption} from './alpha-prime-select-info';

describe('AlphaPrimeSelectInfo', () => {

  let localStore: { [key: string]: string } = {};
  let options: IAlphaPrimeSelectOption[];

  beforeEach(() => {
    options = [
      {
        id: '1',
        caption: 'c1',
        disabled: false,
        data: {info: 'i1'}
      },
      {
        id: '2',
        caption: 'c2',
        disabled: true,
        data: {info: 'i2'}
      }
    ];

    const localStorageMock = (function () {
      return {
        getItem: function (key: string) {
          return localStore[key];
        },
        setItem: function (key: string, value: any) {
          localStore[key] = value.toString();
        },
        removeItem: function (key: string) {
          delete localStore[key];
        }
      };

    })();
    Object.defineProperty(window, 'localStorage', {value: localStorageMock});

  });

  afterEach(() => {
    localStore = {};
  });

  describe('factories', () => {

    it('should create an instance in First mode', () => {
      const si = AlphaPrimeSelectInfo.First(options);
      expect(si).toBeInstanceOf(AlphaPrimeSelectInfo);
      expect(si.initMode).toEqual('first');
      expect(si.optionId).toEqual('1');
    });

    it('should create an instance in None mode', () => {
      const si = AlphaPrimeSelectInfo.None(options);
      expect(si).toBeInstanceOf(AlphaPrimeSelectInfo);
      expect(si.initMode).toEqual('none');
      expect(si.optionId).toBeUndefined();
    });

    it('should create an instance in idOrNone mode with an existing id', () => {
      const si = AlphaPrimeSelectInfo
        .OptionId(options, '1');
      expect(si).toBeInstanceOf(AlphaPrimeSelectInfo);
      expect(si.initMode).toEqual('idOrNone');
      expect(si.optionId).toEqual('1');
    });

    it('should create an instance in idOrNone mode with a non existing id', () => {
      const si = AlphaPrimeSelectInfo
        .OptionId(options, 'wrongId');
      expect(si).toBeInstanceOf(AlphaPrimeSelectInfo);
      expect(si.initMode).toEqual('idOrNone');
      expect(si.optionId).toBeUndefined();
    });

    it('should create an instance in idOrFirst mode with an existing id', () => {
      const si = AlphaPrimeSelectInfo
        .OptionIdOrFirst(options, '1');
      expect(si).toBeInstanceOf(AlphaPrimeSelectInfo);
      expect(si.initMode).toEqual('idOrFirst');
      expect(si.optionId).toEqual('1');
    });

    it('should create an instance in idOrFirst mode with a non existing id', () => {
      const si = AlphaPrimeSelectInfo
        .OptionIdOrFirst(options, 'wrongId');
      expect(si).toBeInstanceOf(AlphaPrimeSelectInfo);
      expect(si.initMode).toEqual('idOrFirst');
      expect(si.optionId).toEqual('1');
    });

    it('should create an instance in lsOrFirst mode with an existing localStorage value', () => {
      localStorage.setItem('lsKey', '2');
      const si = AlphaPrimeSelectInfo
        .LsOrFirst(options, 'lsKey');
      expect(si).toBeInstanceOf(AlphaPrimeSelectInfo);
      expect(si.initMode).toEqual('lsOrFirst');
      expect(si.optionId).toEqual('2');
    });

    it('should create an instance in lsOrFirst mode with a non existing localStorage value', () => {
      const si = AlphaPrimeSelectInfo
        .LsOrFirst(options, 'lsKey');
      expect(si).toBeInstanceOf(AlphaPrimeSelectInfo);
      expect(si.initMode).toEqual('lsOrFirst');
      expect(si.optionId).toEqual('1');
    });

    it('should create an instance in lsOrNone mode with an existing localStorage value', () => {
      localStorage.setItem('lsKey', '2');
      const si = AlphaPrimeSelectInfo
        .LsOrNone(options, 'lsKey');
      expect(si).toBeInstanceOf(AlphaPrimeSelectInfo);
      expect(si.initMode).toEqual('lsOrNone');
      expect(si.optionId).toEqual('2');
    });

    it('should create an instance in lsOrNone mode with a non existing localStorage value', () => {
      const si = AlphaPrimeSelectInfo
        .LsOrNone(options, 'lsKey');
      expect(si).toBeInstanceOf(AlphaPrimeSelectInfo);
      expect(si.initMode).toEqual('lsOrNone');
      expect(si.optionId).toBeUndefined();
    });

    it('should create an instance in lsOrIdOrFirst mode with an existing localStorage value', () => {
      localStorage.setItem('lsKey', '2');
      const si = AlphaPrimeSelectInfo
        .LsOrIdOrFirst(options, 'lsKey', '1');
      expect(si).toBeInstanceOf(AlphaPrimeSelectInfo);
      expect(si.initMode).toEqual('lsOrIdOrFirst');
      expect(si.optionId).toEqual('2');
    });

    it('should create an instance in lsOrIdOrFirst mode with a non existing localStorage value but a valid id', () => {
      const si = AlphaPrimeSelectInfo
        .LsOrIdOrFirst(options, 'lsKey', '2');
      expect(si).toBeInstanceOf(AlphaPrimeSelectInfo);
      expect(si.initMode).toEqual('lsOrIdOrFirst');
      expect(si.optionId).toEqual('2');
    });

    it('should create an instance in lsOrIdOrFirst mode with a non existing localStorage value but a invalid id', () => {
      const si = AlphaPrimeSelectInfo
        .LsOrIdOrFirst(options, 'lsKey', '3');
      expect(si).toBeInstanceOf(AlphaPrimeSelectInfo);
      expect(si.initMode).toEqual('lsOrIdOrFirst');
      expect(si.optionId).toEqual('1');
    });

    it('should create an instance in lsOrIdOrNone mode with an existing localStorage value', () => {
      localStorage.setItem('lsKey', '2');
      const si = AlphaPrimeSelectInfo
        .LsOrIdOrNone(options, 'lsKey', '1');
      expect(si).toBeInstanceOf(AlphaPrimeSelectInfo);
      expect(si.initMode).toEqual('lsOrIdOrNone');
      expect(si.optionId).toEqual('2');
    });

    it('should create an instance in lsOrIdOrNone mode with a non existing localStorage value but a valid id', () => {
      const si = AlphaPrimeSelectInfo
        .LsOrIdOrNone(options, 'lsKey', '2');
      expect(si).toBeInstanceOf(AlphaPrimeSelectInfo);
      expect(si.initMode).toEqual('lsOrIdOrNone');
      expect(si.optionId).toEqual('2');
    });

    it('should create an instance in lsOrIdOrNone mode with a non existing localStorage value but a invalid id', () => {
      const si = AlphaPrimeSelectInfo
        .LsOrIdOrNone(options, 'lsKey', '3');
      expect(si).toBeInstanceOf(AlphaPrimeSelectInfo);
      expect(si.initMode).toEqual('lsOrIdOrNone');
      expect(si.optionId).toBeUndefined();
    });


  });

  describe('get an option by its id', () => {

    it ('getOption should handle undefined', () => {
      const si = AlphaPrimeSelectInfo.First(options);
      const option = si.getOption(undefined);
      expect(option).toBeUndefined();
    });

    it ('getOption should handle not found id', () => {
      const si = AlphaPrimeSelectInfo.First(options);
      expect(() => si.getOption('wrongId'))
        .toThrow('option should not be undefined');
    });

    it ('getOption should handle existing id', () => {
      const si = AlphaPrimeSelectInfo.First(options);
      const option = si.getOption('1');
      expect(option).toBe(options[0]);
    });

  });
});
