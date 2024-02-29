import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlphaLbsService} from "@pvway/alpha-lbs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'sandbox';

  sub = -1;

  /**
   * payload : { hours: number, minutes: number, seconds: number }
  */
  static readonly CLOCK_CHANNEL = AppComponent.name + 'clock_channel1';

  constructor(private  mLbs: AlphaLbsService) {  }

  ngOnInit() {
    this.sub = this.mLbs.subscribe(
      (clock:  {hours: number, minutes: number, seconds: number}) =>
          console.log(clock),
      AppComponent.CLOCK_CHANNEL);

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

  ngOnDestroy() {
    this.mLbs.unsubscribe(this.sub);
  }


}
