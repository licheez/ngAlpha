import {Component, OnInit} from '@angular/core';
import { AlphaPrimeDebugTagComponent } from "@pvway-dev/alpha-prime";
import {ButtonModule} from "primeng/button";
import {AlphaNsService} from "@pvway/alpha-ns";
import {AppSitemap} from "../app.sitemap";
import {AlphaLbsService} from "@pvway/alpha-lbs";
import {IAlphaPage} from "@pvway/alpha-ns";
import {AppComponent} from "../app.component";

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [
    AlphaPrimeDebugTagComponent,
    ButtonModule
  ]
})
export class HeaderComponent implements OnInit {

  tagsHidden = AlphaPrimeDebugTagComponent.hidden;
  currentPage = AppSitemap.welcome.logTitle;
  private navSub = -1;

  constructor(
    private mLbs: AlphaLbsService,
    private mNs: AlphaNsService) { }

  ngOnInit(): void {
    this.navSub = this.mLbs.subscribe(
      (page: IAlphaPage) =>
        this.currentPage = page.logTitle,
      AppComponent.PAGE_UPDATED);
  }

  onToggleTags() {
    this.tagsHidden = !this.tagsHidden;
    AlphaPrimeDebugTagComponent.hide(this.tagsHidden);
  }

  onWelcome(): void {
    this.mNs.navigate(AppSitemap.welcome);
  }

  onPs(): void {
    this.mNs.navigate(AppSitemap.psIntro);
  }
}
