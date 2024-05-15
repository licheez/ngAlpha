import { Component } from '@angular/core';
import {AlphaNsService} from "@pvway/alpha-ns";
import {AppSitemap} from "../../../../app.sitemap";
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'app-com-header',
  standalone: true,
  imports: [
    ButtonModule
  ],
  templateUrl: './com-header.component.html',
  styleUrl: './com-header.component.scss'
})
export class ComHeaderComponent {

  constructor(
    private mNs: AlphaNsService) { }

  onHome(): void {
    this.mNs.navigate(AppSitemap.comIntro);
  }

  onEms(): void {
    this.mNs.navigate(AppSitemap.comEms);
  }
}
