import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlphaLbsService} from "@pvway/alpha-lbs";

@Component({
  selector: 'app-lbs-demo',
  templateUrl: './lbs-demo.component.html',
  styleUrls: ['./lbs-demo.component.scss']
})
export class LbsDemoComponent implements  OnInit, OnDestroy{

  /**
   * payload : { hours: number, minutes: number, seconds: number }
   */
  static readonly CLOCK_CHANNEL = LbsDemoComponent.name + 'clock_channel1';

  clock: {hours: number, minutes: number, seconds: number};

  private sub = -1;
  constructor(
    private mLbs: AlphaLbsService) {
    const now = new Date();
    this.clock = {
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds()
    };
  }

  ngOnInit() {
    this.sub = this.mLbs.subscribe(
      (clock:  {hours: number, minutes: number, seconds: number}) =>
        this.clock = clock,
      LbsDemoComponent.CLOCK_CHANNEL);

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
