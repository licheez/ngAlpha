# AlphaUploadApiService

## Overview

AlphaUploadApiService is a service used for uploading data in chunks and deleting the data using their upload ID. The implementations of the `IAlphaUploadApiService` interface make the tasks of uploading and deleting data easier by taking care of the process flow. This involves breaking the data into chunks and uploading them in sequence.

## Services and Constructor

- `AlphaUploadApiService` is a core service that helps to upload & delete the uploaded data. This class uses the HttpClient to make HTTP calls and post error logs.

## Initialization and Configuration

- `init()` is used for initializing the service. It sets the necessary URLs for upload and delete operations. The chunk size for the upload data can also optionally be specified here.

## Upload Process

- `upload()` is used for starting the upload process. The data to be uploaded and a callback function to notify the progress of the upload are passed as parameters.

## Delete Process

- `deleteUpload()` is used for deleting the uploaded data. The id of the upload entity is passed as a parameter to this function.

## Error Handling and Security

- The service uses the `catchError` operator from RxJs to catch any HTTP Errors that may occur. Additionally, it uses a function implemented from the `IAlphaLoggerService` to post these error logs.
- The upload and delete HTTP requests are authorized using a function implemented from the `IAlphaOAuthService`.

Please ensure that `AlphaUploadApiService` has been provided in your root module.

The `AlphaUploadApiService` is here to help make the uploading and deleting process much easier and seamless for your application.

## Dependencies

- Angular
- HttpClient from `@angular/common/http`
- Observable, Subscriber, of, mergeMap, catchError, throwError from 'rxjs'
- UsoChunkUpload, IAlphaUploadApiService from '@pvway/alpha-common'


# AlphaVersionApiService

`AlphaVersionApiService` is a service class designed to asynchronously fetch application version information from a provided URL and then provide that information as an observable to subscribing components in your application.

## Initialization

Before using `AlphaVersionApiService`, it must be initialized with a URL where the version information can be retrieved from, and optionally, a logger service for logging errors. Here is an example of initialization:

```typescript
alphaVersionApiService.init("http://example.com/version", loggerService);
```
In the example above, `"http://example.com/version"` is the URL that will be hit when `getVersion()` is called. `loggerService` is an instance of a class implementing the `IAlphaLoggerService` interface.

## Fetching the Version

The `getVersion()` method is used to fetch the version information. Here is an example of how to use this method:

```typescript 
alphaVersionApiService.getVersion().subscribe(version => { // Do something with the version. });
```
In the given example, the `getVersion()` method hits the URL provided in `init()` method and then maps the response to what is expected. If an error occurs during the HTTP request, it will be logged using the `postErrorLog()` method from the logger service provided upon initialization.

## Customizing the Get Version Method

In order to replace the default behavior of the `getVersion()` method, a custom method can be injected using `useGetVersion()` method.

```typescript
typescript alphaVersionApiService.useGetVersion(() => // Custom method that returns Observable . );
```
