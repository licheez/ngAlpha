import { AlphaEmsBaseApiEvent } from './alpha-ems-base-api-event';

describe('AlphaEmsBaseApiEvent', () => {
  it('should create an instance', () => {
    const body = {};
    const event = new AlphaEmsBaseApiEvent(
      'create', body, ['key1', 'kay2']);
    expect(event).toBeTruthy();
    expect(event.action).toEqual('create');
    expect(event.body).toEqual(body);
    expect(event.keys.length).toEqual(2);
  });
});
