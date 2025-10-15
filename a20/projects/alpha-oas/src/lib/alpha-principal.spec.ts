import { AlphaPrincipal } from './alpha-principal';
import {AlphaAuthStatusEnum, IAlphaUser} from "./alpha-oas-abstractions";


describe('AlphaPrincipal', () => {

  it('should create an instance', () => {
    const p = new AlphaPrincipal();
    expect(p).toBeTruthy();
    expect(p.user).toBeNull();
    expect(p.status).toEqual(AlphaAuthStatusEnum.Undefined);
    expect(p.isAnonymous).toBeTruthy();
  });

  it('should set and then get status', () => {
    const p = new AlphaPrincipal();
    p.setStatus(AlphaAuthStatusEnum.Authenticated);
    expect(p.status).toEqual(AlphaAuthStatusEnum.Authenticated);
    expect(p.isAuthenticated).toBeTruthy();
  });

  it('should be authenticating', () => {
    const p = new AlphaPrincipal();
    p.setStatus(AlphaAuthStatusEnum.Authenticating);
    expect(p.isAuthenticating).toBeTruthy();
    p.setStatus(AlphaAuthStatusEnum.Refreshing);
    expect(p.isAuthenticating).toBeTruthy();
  });


  it('should set and then get user', () => {
      const p = new AlphaPrincipal();
      const user: IAlphaUser = {
        userId: 'userId',
        username: 'username',
        languageCode: 'zh',
        properties: new Map<string, any>()
      };
      p.setUser(user);
      expect(p.user).toEqual(user);
      const lc = sessionStorage.getItem('alphaLanguageCode');
      expect(lc).toEqual('zh');
      expect(p.languageCode).toEqual('zh');
  });

  it('should clear user', () => {
      const p = new AlphaPrincipal();
      const user: IAlphaUser = {
          userId: 'userId',
          username: 'username',
          languageCode: 'zh',
          properties: new Map<string, any>()
      };
      p.setUser(user);
      p.clearUser();
      expect(p.user).toBeNull();
  });

  it('should get language code from the session storage', () => {
    const p = new AlphaPrincipal();
    sessionStorage.setItem('alphaLanguageCode', 'ru');
    expect(p.languageCode).toEqual('ru');
  });

  it('should get language code from the browser', () => {
    sessionStorage.removeItem('alphaLanguageCode');
    const p = new AlphaPrincipal();
    expect(p.languageCode).toEqual('en');
  });

});
