# AlphaLbs

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.0.

## Description

This package is a tiny local message bus service that enables components and services to communicate via publish/subscribe

## Usage

We have a component or a service that will broadcast a clock object to all listening services or components.

``` typescript

  /**
   * payload : { hours: number, minutes: number, seconds: number }
  */
  static readonly CLOCK_CHANNEL = AppComponent.name + 'clock_channel';

  constructor(private  mLbs: AlphaLbsService) {  }

  ngOnInit() {
    setInterval( 
      () => {
        const now = new Date();
        this.mLbs.publish({
          hours: now.getHours(), 
          minutes: now.getMinutes(), 
          seconds: now.getSeconds()}, 
          AppComponent.CLOCK_CHANNEL);
      }, 800);
  }
  
```

We can now have another component that listens to that given channel and console.log the time

```typescript
  sub = -1;

  constructor(private  mLbs: AlphaLbsService) {  }

  ngOnInit(): void {
    this.sub = this.mLbs.subscribe(
      (clock:  {hours: number, minutes: number, seconds: number}) =>
        console.log(clock),
      AppComponent.CLOCK_CHANNEL);
  }

  ngOnDestroy(): void {
    this.mLbs.unsubscribe(this.sub);
  }

```
