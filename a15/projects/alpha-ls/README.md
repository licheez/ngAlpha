# AlphaLoggerServiceApi a.k.a. AlphaLs

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.10.

## Description

The idea behind this service is to send any errors and/or page navigation events occurring at client side to the API server.

When client applications are failing it stays quite often unknown from the dev team as the error occurs on client side and if the user is not opening a dev console we might never know what really happened.

So, with this service in place, the client application can send error logs to the server.

On top of this, is also sometime very useful also send page navigation events to the server. This can serve several purposes

* Have some statistics about the usage
* Correlate client actions with errors
  * and this can make a big difference when trying to understand the funnel of events before the error occured

## Usage

### Initialization

In order for this service to work properly you will need to provide it with your actual server end points.

This can be done using the following call

with environment.apiHost being the host url. ex https://localhost.7200

``` typescript
  const postNavLogUrl = environment.apiHost + '/alphaLs/navLog';
  const postErrLogUrl = environment.apiHost + '/alphaLs/errLog';

  constructor(private mLs: AlphaLsService) { }

  ngOnInit(): void {
    this.mLs.init(this.postErrLogUrl, this.postNavLogUrl);
  }
```

Alternatively you can also inject your own code for the two calls for example during the init of the app.component

In the following code we will override the standard behaviour of the logError call to add a fourth field 'userId'

``` typescript
  constructor(
    private mLs: AlphaLsService,
    private mHttpClient: HttpClient) {  }

  ngOnInit() {

    this.mLs.usePostErrorLog(
      (context, method, error) => {

        // configure the url to call
        const url = environment.apiHost + '/alphaLogger/logError';

        // add the userId field
        const userId = this.getUserId();

        // call the server end point that accepts a four field body
        this.mHttpClient.post(
            url, {userId, context, method, error})
            .subscribe();
      });
  }

```

### Typical error logging with AlphaLsService

The following method will post an error when the server returns an error response

``` typescript
  constructor(
    private mLs: AlphaLsService,
    private mHttpClient: HttpClient) {  }

  private getUserInfo(): Observable<IUserInfo> {
    const url = environment.apiHost + '/user/getCurrentUserInfo';
    return this.mHttpClient.get<IUserInfo>(url)
      .pipe(
        catchError(
          (error: HttpErrorResponse) => {
            this.mLs.postErrorLog(
              AppComponent.name, 'getUserInfo', JSON.stringify(error));
            return throwError(() => error);
          }));
  }
```

### Logging navigation

#### Objective

Logging user navigation can be useful for statistic but can also be very interesting when it comes to diagnostic bugs. Navigation los enable to understand the user journey funnelling to a given error.

#### Usage

``` typescript
  constructor(
    private mLs: AlphaLsService) {  }

  ngOnInit(): void {
    // let's post a navigation log
    this.mLs.postNavigationLog(
      '/customer/list', // page path
      'Customer list'); // page title
  }

```
