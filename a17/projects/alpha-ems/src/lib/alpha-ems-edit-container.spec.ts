import { AlphaEmsEditContainer } from './alpha-ems-edit-container';
import {IAlphaHttpObjectResultDso} from "@pvway/alpha-common";

interface IEi {
  selectItems: string[]
}
interface IBody {
  id: string,
  name: string
}

describe('AlphaEmsEditContainer', () => {
  const ei: IEi = {
    selectItems: ['option1', 'option2']
  };
  const body: IBody = {
    id: '1',
    name: 'one'
  }

  it('should create an instance', () => {
    const ec =
      new AlphaEmsEditContainer<IBody, IEi>(ei, body);
    expect(ec).toBeTruthy();
    expect(ec.ei).toEqual(ei);
    expect(ec.body).toEqual(body);
  });

  it('should factor from dso', () => {
    const dso: any = {
        ei: {
          selectItems: ['option1', 'option2']
        },
        body: {
          id: '1',
          name: 'one'
        }
    };
    const factorEi = jest.fn(
      (dso: any) => {
        return {
          selectItems: dso.selectItems
        };
      });
    const factorBody = jest.fn(
      (dso: any) => {
        return {
          id: dso.id,
          name: dso.name
        };
      });
    const ec =
      AlphaEmsEditContainer.factorFromDso<IBody, IEi>(
      dso, factorEi, factorBody);
    expect(ec).toBeTruthy();
    expect(ec.ei).toEqual(ei);
    expect(ec.body).toEqual(body);
  });


});
