# AlphaNs (a.k.a. AlphaNavigationService)

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.2.0.


- [AlphaNs (a.k.a. AlphaNavigationService)](#AlphaNs)
  - [Description](#Description)
  - [Installation](#Installation)
  - [Usage](#Usage)
    - [Converting a data URL to a safe resource URL](#getSafeResourceUrl)
    - [Reloading the current web page](#reload)
    - [Navigating to the home page](#reHome)
    - [Navigating to another page and logging the navigation](#navigate)
    - [Opening a specified URL in a new tab](#openUrlInNewTab)
    - [Navigating to a page into a new tab](#navigateToNewTab)
    - [Replacing the query parameters in the URL without reloading the page](#replaceQueryParams)
    - [Opening a data URL in a new tab](#openDataUrlInNewTab)
    - [Downloading a data URL](#downloadDataUrl)
  - [AlphaNsUtils Class - Documentation](#AlphaNsUtils)
    - [Methods](#Methods)
      - [`dataurlToBlob(dataUrl: string, sliceSize?: number): Blob`](#dataurlToBlob)
      - [`dataUrlToUint8Array(dataUrl: string, sliceSize?: number): Uint8Array`](#dataUrlToUint8Array)
      - [`b64ToUint8Array(b64Data: string, sliceSize?: number): Uint8Array`](#b64ToUint8Array)
      - [`b64ToBlob(b64Data: string, contentType?: string, sliceSize?: number): Blob`](#b64ToBlob)
      - [`getBlobUrl(b64Data: string, contentType?: string, sliceSize?: number): string`](#getBlobUrl)

## Description

The AlphaNsService is a core Angular service for handling **strongly typed** navigational tasks in your application. This includes tasks such as navigating and re-routing to different pages, reloading the current page, opening URLs in new tabs, downloading URLs, and sanitizing URLs for resource loading. This service also allows you to initialize and replace query parameters and maintain the application state.

## Installation

This service is provided in the root of the application:

```typescript
@Injectable({
  providedIn: 'root'
})
```
You can inject this service into any component throughout your application.

## Usage

Upon creation, the service requires a Location and DomSanitizer instance to operate:

```typescript
constructor(
  private mLocation: Location, 
  private mSan: DomSanitizer) {}
```
Before using the service, it should be initialized with a Router and home page instance:
```typescript
init(
  router: Router, 
  homePage: IAlphaPage, 
  postNavLog?: (path: string, title: string) => any, 
  notifyNav?: (page: IAlphaPage) => any): void {}
```
The init method let you also pass two optional delegates

    postNavLog: (path: string, title: string) => any

Use this delegate for passing a method that will post the path and the title of navigated pages to your backend. See [**alphaLs**](https://www.npmjs.com/package/@pvway/alpha-ls) from the alpha components suite that allows you to post navigation events to a web api.

    notifyNav: (page: IAlphaPage) => any): void

Use this delegate for passing a method that will be capture any navigation event in your application. See [**alphaLbs**](https://www.npmjs.com/package/@pvway/alpha-lbs) from the alpha components suite that allows you to broadcast any type of event to any type of subscriber (service, component, classes....).

---

The service also implements numerous functionalities like:

### Converting a data URL to a safe resource URL:
```typescript
getSafeResourceUrl(dataUrl: string): SafeResourceUrl {}
```
### Reloading the current web page:
```typescript
reload(): void {}
```
### Navigating to the home page
```typescript
reHome(): void {}
```
### Navigating to another page and logging the navigation:
```typescript
navigate(page: IAlphaPage, pageParams?: any[], queryParams?: any): void {}
```
Notice that the navigate method expects a _IAlphaPage_ parameter

Let's see the IAlphaPage attributes

```typescript
export interface IAlphaPage {
  parentRoute: string;
  route: string;
  area: string;
  logRoute: string;
  logTitle: string;
}

export class AlphaPage implements IAlphaPage {
  parentRoute: string;
  route: string;
  area: string;
  logRoute: string;
  logTitle: string;

  constructor(
    pc: IAlphaPage) {
    this.parentRoute = pc.parentRoute;
    this.route = pc.route;
    this.area = pc.area;
    this.logRoute = pc.logRoute;
    this.logTitle = pc.logTitle;
  }
}
```
The idea behind passing a structure versus a set of strings is to avoid having hardcoded route into your application.

See here after a typical use case.

The application contains three areas (modules) each one with some children pages:

* **account module**
  * accHome
  * accDashboardDetails
* **homePack module**
  * hpHome
* **businessPack module**
  * bpHome
  * bpPur
  * bpSal
  * bpFin
  * bpGen

The idea is to create a class at the root of folder of the application that contains a list of static readonly IAlphaPage objects.

```typescript
import { IAlphaPage } from '@pvway/alpha-ns';

export class AppSitemap {

    //#region root
    static readonly welcome: IAlphaPage = {
        parentRoute: '',
        route: '',
        area: 'top',
        logRoute: '/',
        logTitle: 'WelcomePage'
    };
    static readonly accountOutlet: IAlphaPage = {
        parentRoute: '',
        route: 'acc',
        area: 'acc',
        logRoute: '/acc',
        logTitle: 'Account'
    };
    static readonly homePackOutlet: IAlphaPage = {
        parentRoute: '',
        route: 'hp',
        area: 'hp',
        logRoute: '/hp',
        logTitle: '/HomePack'
    };
    static readonly businessPackOutlet: IAlphaPage = {
      parentRoute: '',
      route: 'bp',
      area: 'bp',
      logRoute: '/bp',
      logTitle: '/BusinessPack'
    };
    
    //#endregion

    //#region Account Module Children
    static readonly accountHome: IAlphaPage = {
        parentRoute: 'acc/',
        route: 'home',
        area: 'acc',
        logRoute: '/acc/dashboard',
        logTitle: 'Account dahsboard'
    };
    static readonly accountDashboardDetail: IAlphaPage = {
        parentRoute: 'acc/',
        route: 'dashboardDetail',
        area: 'acc',
        logRoute: '/acc/detail',
        logTitle: 'Account dahsboard detail'
    };
    //#endregion 

    //#region HomePack Module Children
    static readonly homePackHome: IAlphaPage = {
        parentRoute: 'hp/',
        route: 'home',
        area: 'hp',
        logRoute: '/hp/home',
        logTitle: 'HomePack home'
    };
    //#endregion

    //#region BusinessPack Module Children
    static readonly bpHome: IAlphaPage = {
      parentRoute: 'bp/',
      route: 'home',
      area: 'bp',
      logRoute: '/bp/home',
      logTitle: 'BusinessPack home'
    };
  
    static readonly bpPur: IAlphaPage = {
      parentRoute: 'bp/',
      route: 'pur',
      area: 'bp',
      logRoute: '/bp/pur',
      logTitle: 'BusinessPack purchase operations'
    };
  
    static readonly bpSal: IAlphaPage = {
      parentRoute: 'bp/',
      route: 'sal',
      area: 'bp',
      logRoute: '/bp/sal',
      logTitle: 'BusinessPack sales operations'
    };
  
    static readonly bpFin: IAlphaPage = {
      parentRoute: 'bp/',
      route: 'fin',
      area: 'bp',
      logRoute: '/bp/fin',
      logTitle: 'BusinessPack financial operations'
    };
  
    static readonly bpGen: IAlphaPage = {
      parentRoute: 'bp/',
      route: 'gen',
      area: 'bp',
      logRoute: '/bp/gen',
      logTitle: 'BusinessPack general operations'
    };
    //#endregion
}
```
Navigating to a page is as easy as the following code.
```typescript
  onShowWelcomePage(): void {
    this.mNs.navigate(AppSitemap.welcome);
  }

  onShowAccountPage(): void {
    this.mNs.navigate(AppSitemap.accountOutlet);
  }
```
As you will notice a component navigating to another page does not have to mention any hardcoded route string... This makes your application much easier to maintain. 

### Opening a specified URL in a new tab:
```typescript
typescript openUrlInNewTab(url: string): void {}
```

### Navigating to a page into a new tab:
```typescript
typescript navigateToNewTab(
  rootUrl: string, 
  page: IAlphaPage, 
  pageParams?: any[], 
  queryParams?: any): void {}
```
PS. you need to pass the rootUrl of your app as first param.

### Replacing the query parameters in the URL without reloading the page:
```typescript
typescript replaceQueryParams(
  qParams: string, 
  notify?: (qParams: string) => any): void {}
```

### Opening a data URL in a new tab:
```typescript
typescript openDataUrlInNewTab(
  dataUrl: string, sliceSize?: number): void {}
```

### Downloading a data URL:
```typescript
typescript downloadDataUrl(dataUrl: string, fileName: string): void {}
```

# AlphaNsUtils Class - Documentation

The `AlphaNsUtils` is a utility class written in TypeScript that primarily deals with the conversion of various data formats like data URLs, base64 strings to Blob and Uint8Array objects.

## Methods

### `dataurlToBlob(dataUrl: string, sliceSize?: number): Blob`

This static utility method converts a data URL string to a Blob object.

- `dataUrl: string` - The data URL to be converted.
- `sliceSize: number` - The slice size for splitting the base64 data (optional, defaults to 512).

The method returns a `Blob` object.

### `dataUrlToUint8Array(dataUrl: string, sliceSize?: number): Uint8Array`

This static utility method converts a data URL to Uint8Array.

- `dataUrl: string` - The data URL to convert.
- `sliceSize: number` - The slice size for dividing the base64 string into chunks (optional).

The method returns a `Uint8Array`.

### `b64ToUint8Array(b64Data: string, sliceSize?: number): Uint8Array`

This static utility method converts a base64 string to a Uint8Array.

- `b64Data: string` - The base64 string to convert.
- `sliceSize: number` - The size of each slice when converting the base64 string (optional, defaults to 512).

The method returns a `Uint8Array`.

### `b64ToBlob(b64Data: string, contentType?: string, sliceSize?: number): Blob`

This static utility method converts a base64 string to a Blob object.

- `b64Data: string` - The base64 string to convert.
- `contentType: string` - Optional content type of the Blob.
- `sliceSize: number` - Optional slice size for dividing the base64 data into chunks.

The method returns a `Blob` object.

### `getBlobUrl(b64Data: string, contentType?: string, sliceSize?: number): string`

This static utility method gets the URL of a blob from base64 data.

- `b64Data: string` - The base64 encoded data.
- `contentType: string` - The type of the data (optional).
- `sliceSize: number` - The size of each slice (optional).

The method returns a `string` representing the URL of the blob.

---
Please note that this code is designed to work in Angular applications and uses several libraries from the Angular framework. If you plan to use it in a different context, you would need to replace or remove these dependencies.
