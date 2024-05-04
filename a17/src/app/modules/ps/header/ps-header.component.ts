import { Component } from '@angular/core';
import {AppSitemap} from "../../../app.sitemap";
import {AlphaNsService} from "@pvway/alpha-ns";
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'app-ps-header',
  standalone: true,
  imports: [
    ButtonModule
  ],
  templateUrl: './ps-header.component.html',
  styleUrl: './ps-header.component.scss'
})
export class PsHeaderComponent {

  constructor(
    private mNs: AlphaNsService) { }

  onHome(): void {
    this.mNs.navigate(AppSitemap.psIntro);
  }

  onButtons(): void {
    this.mNs.navigate(AppSitemap.psButtons);
  }

  onScroller(): void {
    this.mNs.navigate(AppSitemap.psScroller);
  }

}
