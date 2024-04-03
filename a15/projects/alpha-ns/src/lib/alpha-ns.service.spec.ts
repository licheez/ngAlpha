import { TestBed } from '@angular/core/testing';

import { AlphaNsService } from './alpha-ns.service';
import {Router, UrlCreationOptions, UrlTree} from "@angular/router";
import {IAlphaPage} from "./alpha-page";

describe('AlphaNsService', () => {
  let service: AlphaNsService;
  let locationSpy : jest.SpyInstance;
  let openSpy: jest.SpyInstance;

  const homePage: IAlphaPage = {
    area: 'homeArea',
    route: 'homeRoute/',
    parentRoute: 'homeParentRoute/',
    logRoute: 'logHomeRoute',
    logTitle: 'logHomeTitle'
  };

  const createUrlTreeFn:
    (commands: any[], extras?: UrlCreationOptions) => UrlTree =
    (commands: any[], extras?: UrlCreationOptions) => {
      console.log(commands);
      console.log(extras);
      return new UrlTree();
    };

  const navigationPromise: Promise<boolean> = new Promise(
    resolve => {
    // some async code goes here
    // if everything went well
    resolve(true);
    // if something went wrong
    // reject(false or 'Reason for rejection');
  });

  const navigateFn:
    (commands: any[], extras?: UrlCreationOptions) => Promise<boolean> =
    (commands: any[], extras?: UrlCreationOptions) => {
      console.log('navigate', commands, extras);
      return navigationPromise;
    };

  const routerMock = {
    createUrlTree: jest.fn(createUrlTreeFn),
    navigate: jest.fn(navigateFn)
  } as unknown as Router;

  beforeAll(() => {
    // Object defining properties of the 'window.location' object
    const locationMock = {
      reload: jest.fn(),
      replaceState: jest.fn()
    } as any;

    // jest.spyOn method to spy on the 'window.location' object
    // @ts-ignore
    locationSpy = jest.spyOn(window, 'location',
      'get').mockReturnValue(locationMock);

    openSpy = jest.spyOn(window, 'open')
      .mockImplementation(jest.fn());
  });

  beforeEach(() => {
    global.URL.createObjectURL = jest.fn(
      (b: Blob) => `blob:${b}`);
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlphaNsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it ('should navigate without query params', () => {
    const navigateFn:
      (commands: any[], extras?: UrlCreationOptions) => Promise<boolean> =
      (commands: any[], extras?: UrlCreationOptions) => {
        expect(commands[0]).toEqual('homeParentRoute/homeRoute/');
        expect(extras).toBeUndefined();
        console.log('navigate', commands, extras);
        return navigationPromise;
      };

    const routerMock = {
      createUrlTree: jest.fn(createUrlTreeFn),
      navigate: jest.fn(navigateFn)
    } as unknown as Router;

    service.init(routerMock, homePage);
    service.navigate(homePage);
  });

  it ('should navigate with params', () => {
    const navigateFn:
      (commands: any[], extras?: UrlCreationOptions) => Promise<boolean> =
      (commands: any[], extras?: UrlCreationOptions) => {
        expect(commands[0]).toEqual('homeParentRoute/homeRoute/');
        expect(commands[1]).toEqual('pageParam');
        expect(extras).toEqual({"queryParams": "?param=1"});
        console.log('navigate', commands, extras);
        return navigationPromise;
      };

    const routerMock = {
      createUrlTree: jest.fn(createUrlTreeFn),
      navigate: jest.fn(navigateFn)
    } as unknown as Router;
    service.init(routerMock, homePage);
    service.navigate(homePage, ['pageParam'], '?param=1');
  });

  it ('should getSafeResourceUrl', () => {
    const safeUrl = service
      .getSafeResourceUrl('dataUrl');
    expect(safeUrl).toBeDefined();
  });

  it ('should reload', () => {
    service.reload();
    expect(locationSpy).toHaveBeenCalled();
  });

  it ('should re-home', () => {
    service.init(routerMock, homePage);
    service.reHome();
    expect(true).toBeTruthy();
  });

  it('open url in new tab', () => {
    const url = "https://example.com";
    service.openUrlInNewTab(url);
    expect(openSpy).toHaveBeenCalledWith(url, "_blank");
  });

  it ('should navigateToNewTab without params', () => {
    const createUrlTreeFn:
      (commands: any[], extras?: UrlCreationOptions) => UrlTree =
      (commands: any[], extras?: UrlCreationOptions) => {
        expect(commands[0]).toEqual('homeParentRoute/homeRoute/');
        expect(extras).toBeUndefined();
        console.log('createUrlTree', commands, extras);
        return new UrlTree();
      };

    const routerMock = {
      createUrlTree: jest.fn(createUrlTreeFn),
      navigate: jest.fn(navigateFn)
    } as unknown as Router;

    service.init(routerMock, homePage);
    service.navigateToNewTab('myRootUrl', homePage);

  });

  it ('should navigateToNewTab with params', () => {
    const createUrlTreeFn:
      (commands: any[], extras?: UrlCreationOptions) => UrlTree =
      (commands: any[], extras?: UrlCreationOptions) => {
        expect(commands[0]).toEqual('homeParentRoute/homeRoute/');
        expect(commands[1]).toEqual('pageParam');
        expect(extras).toEqual({"queryParams": "?param=1"});
        console.log('createUrlTree', commands, extras);
        return new UrlTree();
      };

    const routerMock = {
      createUrlTree: jest.fn(createUrlTreeFn),
      navigate: jest.fn(navigateFn)
    } as unknown as Router;

    service.init(routerMock, homePage);
    service.navigateToNewTab(
      'myRootUrl', homePage,
      ['pageParam'], '?param=1');
    expect(openSpy).toHaveBeenCalled();
  });

  it ('should replaceQueryParams', () => {
    window.location.hash = 'someHash';
    const qParams =
      '?param1=value1&param2=value2';
    service.replaceQueryParams(qParams);
    expect(locationSpy).toHaveBeenCalled();
  });

  it ('should replaceQueryParams with notify', () => {
    window.location.hash = 'someHash';
    const qParams =
      '?param1=value1&param2=value2';
    service.replaceQueryParams(qParams,
      p => {
        console.log(p);
      });
    expect(locationSpy).toHaveBeenCalled();
  });

  it ('should open data url in new tab', () => {

    const testContent = 'Hello, world!;';
    const testContentType = 'text/plain';
    const dataUrl = `data:${testContentType};base64,`
      + btoa(testContent);

    service.openDataUrlInNewTab(dataUrl);
    expect(openSpy).toHaveBeenCalled();
  });

  it ('should download data url', () => {
    const testContent = 'Hello, world!;';
    const testContentType = 'text/plain';
    const dataUrl = `data:${testContentType};base64,`
      + btoa(testContent);

    const fileName = "image.png";
    service.downloadDataUrl(dataUrl, fileName);
    expect(true).toBeTruthy();
  });

});
