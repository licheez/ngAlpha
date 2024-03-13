# AlphaTranslationService a.k.a. AlphaTs

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.2.0.

The idea behind this service is to provide a translation service for front end apps. 

Actually, the scope is a little bit bigger as it is often coupled with the [ExcelTranslationProvider](https://www.nuget.org/packages/ExcelTranslationProvider.nc6) (dotNet) component that stores translations as (embedded) Excel sheets.

## Design in a nutshell

At server side the WebApi is exposing an end point that returns translations in the form of a dictionary.

Actually, the exact structure of the data returned by the Web Api is the following:

```json
{
    "alpha.buttons.add": {
      "en": "Add",
      "fr": "Ajouter",
      "nl": "Toevoegen"
    },
    "alpha.buttons.cancel": {
      "en": "Cancel",
      "fr": "Annuler",
      "nl": "Annuleren"
    },
    "alpha.buttons.delete": {
      "en": "Delete",
      "fr": "Supprimer",
      "nl": "Verwijderen"
    }
}
```

As you can see, this is actually a dictionary&lt;key: string, dictionary&lt;isoLanguageCode: string, translation: string&gt;&gt;

At client side the browser stores the translations into its localStorage as a wrapper that contains
* the date of lastUpdate
* the dictionary of translations.

When starting the app the client calls the server passing the last update date (the one he finds in his local storage).

PS. The first time the client connects to this server end point, its localStorage is empty, as such the client sends a request passing the very old Unix epoch date.

The server compares the date provided by the client with the one at server side.

If the translations needs to be refreshed (i.e. the server translation date is fresher than the client one), then the server sends back a new version of the dictionary.

The client stores the new dictionary in its localStorage.

However, when the client translations are up to date, the server only return 'isUpToDate' set to true. The client does not need to refresh its localStorage as its translations are still valid.

## Dependencies

### AlphaLoggingService (a.k.a. alpha-ls)

AlphaLsService (when initialized) is used for logging any error and also to report any missing translation so that those translations gaps can be fixed by the dev team.

If your application uses alpha-ls it might be already initialized. 

Otherwise, you can also initialize it using the init method. (see initialization section here after.)

### AlphaLocalBusService (a.k.a. alpha-lbs)

AlphaLbsService is used to listen the local bus channel 'LANGUAGE_CODE_UPDATE';

When, in your application, the user language changes, you should publish the new languageCode (iso) to the LocalBus.

If you do so, the TranslationService will intercept this change and update its private mLanguageCode variable.

See the service constructor here after.

```typescript
...
  private mLanguageCode = 'en';

constructor(
  private mApi: AlphaTsApiService,
  private mLs: AlphaLsService,
  lbs: AlphaLbsService) {
  this.mTranslationCache = AlphaTranslationCache.default;

  // listen to any update of the language code
  lbs.subscribe((languageCode: string) =>
      this.changeLanguageCode(languageCode),
    "LANGUAGE_CODE_UPDATED");
}
...
```

## Initialization

As usual there is a small configuration for this service to work properly.

You'll need to pass the url of your server end point.

The following code initialize the translation service when the app starts.

```typescript

...
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  ready = false;

  constructor(
    private mTs: AlphaTsService) {
  }

  ngOnInit() {
    // define the end point that delivers translation cache updates
    const tcUpdateUrl = environment.apiHost + '/getTranslationCacheUpdate';
    // define the end point that alpha-ls uses for logging errors
    const postErrLogUrl = environment.apiHost + '/postErrorLog';
    this.mTs.init(tcUpdateUrl, postErrLogUrl).subscribe({
        next: tsStatus => {
          console.log(tsStatus);
          this.ready = true;
        }
      });
  }

}

```

and the template 
```html
<div *ngIf="ready">
  <app-header></app-header>
  <router-outlet></router-outlet>
</div>
```

The init call is asynchronous. In the implementation above we only set the ready flag to true when the translations are loaded...

As you can see the user will have to wait until the translations are loaded before viewing any page in the app.

## Usage

With this service all translations will be managed by the code... that makes your html much clearer and easier to maintain.

```typescript
@Component({
  selector: 'app-ts-demo',
  standalone: true,
  imports: [],
  templateUrl: './ts-demo.component.html',
  styleUrl: './ts-demo.component.scss'
})
export class TsDemoComponent {

  titleLit: string;

  constructor(ts: AlphaTsService) {
    this.titleLit = ts.getTr('demoTs.title');
  }
```

I use the suffix Lit for the literals so that they are clearly identified in the template.

and the template looks like this.

```html
<h1>{{titleLit}}</h1>
```

With this principle in place your template should never contain any translations.

## Advanced usage

```typescript

@Component({
  selector: 'app-ts-demo',
  standalone: true,
  imports: [],
  templateUrl: './ts-demo.component.html',
  styleUrl: './ts-demo.component.scss'
})
export class TsDemoComponent implements OnInit, OnDestroy {

  private sub = -1;

  titleLit: string | undefined;
  private setLiterals() {
    this.titleLit = this.mTs.getTr('demoTs.title');
  }

  constructor(
    private mTs: AlphaTsService,
    private mLbs: AlphaLbsService) {
    this.setLiterals();
  }

  ngOnInit(): void {
    this.sub = this.mLbs.subscribe(
      (lc: string) => {
        this.mTs.changeLanguageCode(lc);
        this.setLiterals();
      },
      'LANGUAGE_CODE_UPDATED');
  }

  ngOnDestroy() {
    this.mLbs.unsubscribe(this.sub);
  }

}

```

This implementation uses the AlphaLbsService.

A component that updates the user language could also use the AlphaLbsService for publishing the value of the selected user language with the channel 'LANGUAGE_CODE_UPDATED';

```typescript
onLanguageChanged(languageCode: string): void {
    this.mLbs.publish(languageCode, 'LANGUAGE_CODE_UPDATED');
}
```

As a side effect of this publication your component will change the language code used by the translation service and re-populate the literals.

for more information see [AlphaLbsService](https://www.npmjs.com/package/@pvway/alpha-lbs).

## Overriding the standard API call

If needed you can also override the standard behaviour of the translation service Api (the service that gets the translations from the backend);

For this you may use the following method:

```typescript
useGetTranslationCacheUpdate(getTranslationCacheUpdate: (lastUpdateDate: Date) =>
  Observable<IAlphaTranslationCache | null>): void;
```

And you provide your own method that returns an observable with an ITranslationCache object for a given date.

## Backend side

See here after an example of implementation at back-end side... here in dotNet core 6

``` csharp
    [HttpGet("getTranslationCacheUpdate")]
    public async Task<ActionResult> GetTranslationCacheUpdate(DateTime clientDate)
    {
        DsoHttpResult<AlphaDsoTranslationsCacheUpdate> hRes;
        try
        {
            clientDate = clientDate.ToUniversalTime();
            var tc = (IAlphaTranslationCache?) _sp.GetService(
                typeof(IAlphaTranslationCache));
            if (tc == null) throw new Exception("tc should not be null");
            var serverDate = tc.LastUpdateDateUtc;
            var dif = serverDate - clientDate;
            var dso = dif.TotalSeconds <= 1.0
                ? new AlphaDsoTranslationsCacheUpdate(null, null)
                : new AlphaDsoTranslationsCacheUpdate(serverDate, tc.Translations);
            hRes = new DsoHttpResult<AlphaDsoTranslationsCacheUpdate>(dso);
        }
        catch (Exception e)
        {
            await Ls.LogAsync(e);
            hRes = new DsoHttpResult<AlphaDsoTranslationsCacheUpdate>(e);
        }

        return hRes.GetActionResult(this);
    }

```

here after the DsoHttpResult object that wraps the response data

```csharp
// Decompiled with JetBrains decompiler
// Type: pvWay.MethodResultWrapper.nc6.DsoHttpResult`1
// Assembly: pvWay.MethodResultWrapper.nc6, Version=1.0.2.0, Culture=neutral, PublicKeyToken=null
// MVID: 64113074-5D4E-48F5-9DEB-A342FE05D3E6
// Assembly location: C:\Users\pierr\.nuget\packages\pvway.methodresultwrapper.nc6\1.0.2\lib\net6.0\pvWay.MethodResultWrapper.nc6.dll

using System;

#nullable enable
namespace pvWay.MethodResultWrapper.nc6
{
  public class DsoHttpResult<T> : DsoHttpResult
  {
    public T Data { get; }

    public DsoHttpResult(T data) => this.Data = data;

    public DsoHttpResult(T data, bool hasMoreResults)
      : base(SeverityEnum.Ok, hasMoreResults)
    {
      this.Data = data;
    }

    public DsoHttpResult(T data, DsoHttpResultMutationEnum mutation)
      : base(SeverityEnum.Ok, false, mutation)
    {
      this.Data = data;
    }

    public DsoHttpResult(IMethodResult res)
      : base(res)
    {
    }

    public DsoHttpResult(Exception e)
      : base(e)
    {
    }
  }
}

```

now the embedded data object

``` csharp
public class AlphaDsoTranslationsCacheUpdate
{
    public bool IsUpToDate { get; }

    public AlphaDsoTranslationsCache? TranslationsCache { get; }

    public AlphaDsoTranslationsCacheUpdate(
        DateTime? lastUpdateDate,
        IDictionary<string, IDictionary<string, string>>? translations)
    {
        if (lastUpdateDate.HasValue)
        {
            IsUpToDate = false;
            TranslationsCache = new AlphaDsoTranslationsCache(lastUpdateDate.Value, translations);
        }
        else
        {
            IsUpToDate = true;
            TranslationsCache = null;
        }
    }

}
```
and finally the TranslationCache

```csharp
public class AlphaDsoTranslationsCache
{
    public DateTime LastUpdateDate { get; }
    public IDictionary<string, IDictionary<string, string>>? Translations { get; }

    public AlphaDsoTranslationsCache(
        DateTime lastUpdateDate,
        IDictionary<string, IDictionary<string, string>>? translations)
    {
        LastUpdateDate = lastUpdateDate;
        Translations = translations;
    }
}
```
