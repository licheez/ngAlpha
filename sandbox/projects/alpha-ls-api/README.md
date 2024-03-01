# AlphaLoggerServiceApi a.k.a. AlphaLsApi

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.0.

## Description

The idea behind this service is to send any errors and/or page navigation events occuring at client side to the API server.

When client applications are failing it stays quite often unknown from the dev team as the error occurs on client side and if the user is not opening a dev console we might never know what really happened.

So, with this service in place, the client application can send error logs to the server.

On top of this, is also sometime very useful also send page navigation events to the server. This can serve several purposes

* Have some statistics about the usage
* Correlate client actions with errors 
  * and this can make a big difference when trying to understand the funnel of events before the error occured


## Running unit tests

Run `ng test AlphaLsApi` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Usage

### Configuration

In order for this service to work properly you will need to provide it with your actual server end points.

This can be done using the following call

with environment.apiHost being the host url. ex https://localhost.7200

``` typescript
  const loggerServiceConfig: IAlphaLsApiConfig = new AlphaLsApiConfig({
    postNavigationLogUrl: environment.apiHost/alphaLs/navLog,
    postErrorLogUrl: environment.apiHost/alphaLs/errLog
  });

  @NgModule({
      ...
      imports: [
        ...,
        AlphaLsApiModule.forRoot(loggerServiceConfig),
        ...
  )}
```

Alternatively you can also inject your own code for the two calls for example during the init of the app.component

In the following code we will override the standard behaviour of the logError call to add a fourth field 'userId'

``` typescript
  constructor(
    private mLs: AlphaLsApiService,
    private mHttpClient: HttpClient) {  }

  ngOnInit() {

    this.mLs.usePostErrorLog(
      (context, method, error) => {

        // configure the url to call
        const url = environment.apiHost + '/alphaLogger/logError';

        // add the userId field
        const userId = this.getUserId();

        // call the server end point that accepts a four field body
        return this.mHttpClient.post(
            url, {userId, context, method, error}).subscribe();
      });
  }

```

### Code sample

The following method will post an error when the the server returns an error response 

``` typescript
  constructor(
    private mLs: AlphaLsApiService,
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
