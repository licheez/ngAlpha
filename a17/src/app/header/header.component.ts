import { Component} from '@angular/core';
import { AlphaPrimeDebugTagComponent } from "@pvway/alpha-prime";
import {ButtonModule} from "primeng/button";
import {AlphaNsService} from "@pvway/alpha-ns";
import {AppSitemap} from "../app.sitemap";

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
export class HeaderComponent {

  tagsHidden = AlphaPrimeDebugTagComponent.hidden;

  constructor(
    private mNs: AlphaNsService) { }

  onToggleTags() {
    this.tagsHidden = !this.tagsHidden;
    AlphaPrimeDebugTagComponent.hide(this.tagsHidden);
  }

  onWelcome(): void {
    this.mNs.navigate(AppSitemap.welcome);
  }

  onPs(): void {
    this.mNs.navigate(AppSitemap.psOutlet);
  }
}
