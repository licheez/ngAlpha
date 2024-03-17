import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {environment} from "../environments/environment";
import {AlphaLsService} from "@pvway/alpha-ls";
import {AlphaLbsService} from "@pvway/alpha-lbs";
import {AlphaOasService, AlphaPrincipal} from "@pvway/alpha-oas";
import {AlphaTsService} from "@pvway/alpha-ts";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  pendingInitCount = 2;

  title = 'a17';

  constructor(
    private mLs: AlphaLsService,
    private mLbs: AlphaLbsService,
    private mOas: AlphaOasService,
    private mTs: AlphaTsService) {
  }

  ngOnInit() {

    // INITIALIZING OAUTH SERVICE
    // --------------------------
    const getMeUrl = environment.apiHost + '/getMe';
    const refreshUrl = environment.apiHost + '/token';
    const signInUrl = environment.apiHost + '/token';
    const watchOasStateChanges = (principal: AlphaPrincipal) => {
      this.mLbs.publish(principal, 'PRINCIPAL_UPDATED');
    }
    this.mOas.init(
      getMeUrl, refreshUrl, signInUrl,
      this.mLs.postErrorLog, watchOasStateChanges)
      .subscribe({
        next: oasStatus => {
          console.log(oasStatus);
          this.pendingInitCount--;
        }
      });

    // INITIALIZING TRANSLATION SERVICE
    // --------------------------------
    const tcUpdateUrl = environment.apiHost + '/getTranslationCacheUpdate';
    this.mTs.init(tcUpdateUrl).subscribe({
      next: tsStatus => {
        console.log(tsStatus);
        this.pendingInitCount--;
      }
    });
  }

}
