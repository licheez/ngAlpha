import {TestBed} from '@angular/core/testing';
import {AlphaNsService} from './alpha-ns.service';
import {Router, UrlCreationOptions, UrlTree} from "@angular/router";
import {IAlphaPage} from "./alpha-page";

describe('AlphaNsService', () => {
  let service: AlphaNsService;

  const postNavigationLog =
    jasmine.createSpy('postNavigationLog');

  const notifyNav =
    jasmine.createSpy('notifyNav', (page: IAlphaPage) => {
      console.log(page);
    });

  const homePage: IAlphaPage = {
    area: 'homeArea',
    route: 'homeRoute/',
    parentRoute: 'homeParentRoute/',
    logRoute: 'logHomeRoute',
    logTitle: 'logHomeTitle'
  };

  const reloadSpy = jasmine.createSpy('reload');
  const hashSpy = jasmine.createSpy('hash');
  const openSpy = jasmine.createSpy('open');

  const windowMock = {
    open: openSpy,
    location: {
      reload: reloadSpy,
      hash: hashSpy.and.returnValue('someHash'),
    }
  } as unknown as Window;

  const routerMock = {
    createUrlTree: jasmine.createSpy(
      'createUrlTree', (
        commands: any[], extras?: UrlCreationOptions) => {
        console.log(commands);
        console.log(extras);
        return new UrlTree();
      }).and.callThrough(),
    navigate: jasmine.createSpy('navigate')
      .and.returnValue(Promise.resolve(true))
  } as unknown as Router;

  beforeEach(() => {
    // (globalThis as any).URL = { createObjectURL: jasmine.createSpy('createObjectURL').and.callFake((b: Blob) => `blob:${b}`) };
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlphaNsService);
  });

  afterEach(() => {
    // Jasmine spies are reset in beforeEach
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should init', () => {
    service.init(routerMock, homePage, postNavigationLog, notifyNav);
    expect(service['_router']).toEqual(routerMock);
    expect(service['_homePage']).toEqual(homePage);
    service['_postNavigationLog']('path', 'title');
    expect(postNavigationLog).toHaveBeenCalledWith('path', 'title');
    service['_notifyNavigation'](homePage);
    expect(notifyNav).toHaveBeenCalledWith(homePage);
  });

  it('should navigate without query params', () => {
    service.init(routerMock, homePage, postNavigationLog);
    service.navigate(homePage);
    expect(postNavigationLog).toHaveBeenCalledWith(
      homePage.logRoute, homePage.logTitle);
    expect(routerMock.navigate).toHaveBeenCalled();
  });

  it('should navigate with params', () => {
    service.init(routerMock, homePage);
    service.navigate(homePage, ['pageParam'], '?param=1');
    expect(routerMock.navigate).toHaveBeenCalled();
  });

  it('should getSafeResourceUrl', () => {
    const safeUrl = service.getSafeResourceUrl('dataUrl');
    expect(safeUrl).toBeDefined();
  });

  it('should reload the page using injected window via init', () => {
    service.init(routerMock, homePage,
      postNavigationLog, notifyNav, windowMock);
    service.reload();
    expect(reloadSpy).toHaveBeenCalled();
  });

  it('should re-home', () => {
    const spy = spyOn(service, 'navigate');
    service.init(routerMock, homePage);
    service.reHome();
    expect(spy).toHaveBeenCalledWith(homePage);
  });

  it('should guard', () => {
    const spy = spyOn(service, 'navigate');
    service.init(routerMock, homePage);
    service.guard(() => true);
    expect(spy).toHaveBeenCalledWith(homePage);
  });

  it('should open a URL in a new tab using injected window via init', () => {
    service.init(routerMock, homePage,
      postNavigationLog, notifyNav, windowMock);
    const testUrl = 'https://example.com';
    service.openUrlInNewTab(testUrl);
    expect(openSpy).toHaveBeenCalledWith(testUrl, '_blank');
  });

  it('should navigateToNewTab without params', () => {
    const openSpy = jasmine.createSpy('open');
    const mockWindow = {
      open: openSpy
    } as unknown as Window;
    service.init(routerMock, homePage, postNavigationLog, notifyNav, mockWindow);

    service.navigateToNewTab('myRootUrl', homePage);
    expect(openSpy).toHaveBeenCalled();
  });

  it('should navigateToNewTab with params', () => {
    const openSpy = jasmine.createSpy('open');
    const mockWindow = {
      open: openSpy
    } as unknown as Window;
    service.init(routerMock, homePage, postNavigationLog, notifyNav, mockWindow);
    service.navigateToNewTab(
      'myRootUrl', homePage,
      ['pageParam'], '?param=1');
    expect(openSpy).toHaveBeenCalled();
  });

  it('should replaceQueryParams', () => {
    const qParams = '?param1=value1&param2=value2';
    service.replaceQueryParams(qParams,
        info => console.log(info));
  });

  it('should open data url in new tab using injected urlFactory', () => {
    const testContent = 'Hello, world!;';
    const testContentType = 'text/plain';
    const dataUrl = `data:${testContentType};base64,` + btoa(testContent);
    const blobUrl = 'blob:test-url';
    const createObjectURLSpy = jasmine.createSpy('createObjectURL').and.returnValue(blobUrl);
    const urlFactoryMock = { createObjectURL: createObjectURLSpy };
    service.init(routerMock, homePage,
      postNavigationLog, notifyNav,
      windowMock, urlFactoryMock);
    service.openDataUrlInNewTab(dataUrl);
    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(openSpy).toHaveBeenCalledWith(blobUrl, '_blank');
  });

  it('should download data url using injected window via init', () => {
    // Arrange
    const clickSpy =
      jasmine.createSpy('click');
    const removeChildSpy =
      jasmine.createSpy('removeChild');
    const appendChildSpy =
      jasmine.createSpy('appendChild');
    const anchorMock = {
      download: '',
      href: '',
      click: clickSpy
    } as unknown as HTMLAnchorElement;

    // Mock document.createElement to return anchorMock
    const createElementSpy =
      jasmine.createSpy('createElement').and.returnValue(anchorMock);

    // Mock document.body
    const bodyMock = {
      appendChild: appendChildSpy,
      removeChild: removeChildSpy
    };

    // Extend windowMock with document
    const windowWithDocumentMock = {
      ...windowMock,
      document: {
        createElement: createElementSpy,
        body: bodyMock
      }
    } as unknown as Window;

    service.init(routerMock, homePage, postNavigationLog, notifyNav, windowWithDocumentMock);

    const testDataUrl =
      'data:text/plain;base64,SGVsbG8sIHdvcmxkIQ==';
    const testFileName = 'test.txt';

    // Act
    service.downloadDataUrl(testDataUrl, testFileName);

    // Assert
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(anchorMock.download).toBe(testFileName);
    expect(anchorMock.href).toBe(testDataUrl);
    expect(appendChildSpy).toHaveBeenCalledWith(anchorMock);
    expect(clickSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalledWith(anchorMock);
  });

});
