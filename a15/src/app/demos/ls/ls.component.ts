import {Component, OnInit} from '@angular/core';
import {AlphaLsService} from "@pvway/alpha-ls";

@Component({
  selector: 'app-ls',
  templateUrl: './ls.component.html',
  styleUrls: ['./ls.component.scss']
})
export class LsComponent implements OnInit {

  constructor(private mLs: AlphaLsService) { }

  errLog: {context: string, method: string, error: string} | undefined;
  navLog: {path: string, title: string} | undefined;

  ngOnInit() {
    this.mLs.init();
    this.mLs.usePostErrorLog(
      (context: string, method: string, error: string) => {
        this.errLog = {context, method, error};
      });
    this.mLs.usePostNavigationLog(
      (path: string, title: string) => {
        this.navLog = {path, title};
      });
    this.mLs.postErrorLog('someContext', 'someMethod', 'someError');
    this.mLs.postNavigationLog('somePath', 'someTitle');
  }

}
