import {IAlphaPage} from "../../projects/alpha-ns/src/lib/alpha-page";

export class AppSitemap {

  //#region root

  static welcome: IAlphaPage = {
    parentRoute: '',
    route: '',
    area: 'top',
    logRoute: '/',
    logTitle: 'Welcome page'
  }

  static psOutlet: IAlphaPage = {
    parentRoute: '',
    route: 'ps',
    area: 'ps',
    logRoute: '/ps',
    logTitle: 'Prime Service'
  };

  //#endregion

  //#region Ps
  static psHome: IAlphaPage = {
    parentRoute: 'ps',
    route: 'home',
    area: 'ps',
    logRoute: '/ps/home',
    logTitle: 'Prime Service: Home'
  };

  static psButtons: IAlphaPage = {
    parentRoute: 'ps',
    route: 'buttons',
    area: 'ps',
    logRoute: '/ps/buttons',
    logTitle: 'Prime Service: Buttons'
  };

  //#endregion

}
