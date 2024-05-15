import {Component, OnInit} from '@angular/core';
import {AlphaLbsService} from "@pvway/alpha-lbs";
import {AppComponent} from "../../../../app.component";
import {AppSitemap} from "../../../../app.sitemap";

@Component({
  selector: 'app-ps-home-page',
  standalone: true,
  imports: [],
  templateUrl: './ps-home-page.component.html',
  styleUrl: './ps-home-page.component.scss'
})
export class PsHomePageComponent implements OnInit {

  constructor(
    private mLbs: AlphaLbsService) {
  }

  ngOnInit() {
    this.mLbs.publish(
      AppSitemap.psIntro,
      AppComponent.PAGE_UPDATED);
  }
}
