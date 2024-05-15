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
    logTitle: 'Prime Services'
  };

  static comOutlet: IAlphaPage = {
    parentRoute: '',
    route: 'com',
    area: 'com',
    logRoute: '/com/outlet',
    logTitle: 'Common Services'
  }

  //#endregion

  //#region Ps
  static psIntro: IAlphaPage = {
    parentRoute: 'ps/',
    route: 'intro',
    area: 'ps',
    logRoute: '/ps/intro',
    logTitle: 'Prime Services: Intro'
  };

  static psAutoComplete: IAlphaPage = {
    parentRoute: 'ps/',
    route: 'autoComplete',
    area: 'ps',
    logRoute: '/ps/autoComplete',
    logTitle: 'Prime Services: AutoComplete'
  }

  static psButtons: IAlphaPage = {
    parentRoute: 'ps/',
    route: 'buttons',
    area: 'ps',
    logRoute: '/ps/buttons',
    logTitle: 'Prime Services: Buttons'
  };

  static psModals: IAlphaPage = {
    parentRoute: 'ps/',
    route: 'modals',
    area: 'ps',
    logRoute: '/ps/modals',
    logTitle: 'Prime Services: Modals'
  };

  static psScroller: IAlphaPage = {
    parentRoute: 'ps/',
    route: 'scroller',
    area: 'ps',
    logRoute: '/ps/scroller',
    logTitle: 'Prime Services: Scroller'
  };

  //#endregion

  //#region Com
  static comIntro: IAlphaPage = {
    parentRoute: 'com/',
    route: 'intro',
    area: 'com',
    logRoute: '/com/intro',
    logTitle: 'Common Services: Intro'
  }
  static comEms: IAlphaPage = {
    parentRoute: 'com/',
    route: 'ems',
    area: 'com',
    logRoute: '/com/ems',
    logTitle: 'Common Services: Ems'
  }
  //#endregion

}
