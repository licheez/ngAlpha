import {AlphaUserFactory} from "./alpha-user";

describe('AlphaUser', () => {
  it('factor from dso', () => {
    const dso: any = {
      userId: 'userId',
      username: 'username',
      languageCode: 'en',
      userProperties: {
        firstName: 'firstName',
        lastName: 'lastName'
      }
    };
    const user = AlphaUserFactory.factorFromDso(dso);
    expect(user).toBeTruthy();
    expect(user.userId).toEqual('userId');
    expect(user.username).toEqual('username');
    expect(user.languageCode).toEqual('en');
    const props = user.properties;
    expect(props).toBeTruthy();
    expect(props.get('firstName')).toEqual('firstName');
    expect(props.get('lastName')).toEqual('lastName');
  });
});
