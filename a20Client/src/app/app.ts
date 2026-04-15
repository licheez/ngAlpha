import {Component, inject, OnInit, signal, Type} from '@angular/core';

import {Router, RouterOutlet} from '@angular/router';
import {HttpClient} from '@angular/common/http';

import {AlphaEmsService, AlphaUploadApiService} from '@pvway/alpha-common';
import {AlphaLbsService} from '@pvway/alpha-lbs';
import {AlphaLsService} from '@pvway/alpha-ls';
import {AlphaNsService, IAlphaPage} from '@pvway/alpha-ns';
import {AlphaOasService} from '@pvway/alpha-oas';
import {AlphaPrimeModalService, AlphaPrimeService, IAlphaPrimeModalConfig} from '@pvway/alpha-prime';
import {AlphaTsService} from '@pvway/alpha-ts';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('a20Client');

  private readonly mHttp = inject(HttpClient);
  private readonly mRouter = inject(Router);

  private readonly mEms = inject(AlphaEmsService);
  private readonly mLbs = inject(AlphaLbsService);
  private readonly mLs = inject(AlphaLsService);
  private readonly mNs = inject(AlphaNsService);
  private readonly mOas = inject(AlphaOasService);
  private readonly mMs = inject(AlphaPrimeModalService);
  private readonly mPs = inject(AlphaPrimeService);
  private readonly mTs = inject(AlphaTsService);

  private readonly mUs = inject(AlphaUploadApiService)

  ngOnInit(): void {
    this.initAlpha();
  }

  private initAlpha(): void {
    console.log('initializing Alpha');

    console.log('initializing AlphaLsService');
    this.mLs.init(
      this.mHttp,
      'postErrorLogUrl',
      'postNavigationLogUrl');

    console.log('initializing AlphaEmsService');
    this.mEms.init(
      this.mHttp,
      this.mOas.authorize,
      this.mLs.postErrorLog,
      this.mLbs.publish);

    console.log('initializing AlphaModalService');
    this.mMs.init(
      (component: Type<any>, dds: IAlphaPrimeModalConfig ) => {},
      this.mLs.postNavigationLog, undefined);

    console.log('initializing AlphaNavigationService');
    this.mNs.init(
      this.mRouter,
      {} as any as IAlphaPage,
      this.mLs.postNavigationLog);

    console.log('initializing AlphaOAuthService');
    this.mOas.init(
      this.mHttp,
      undefined,
      undefined,
      undefined,
      this.mLs.postErrorLog,
      principal => console.log(principal));

    console.log('initializing AlphaPrimeService');
    this.mPs.init(
      false,
      this.mTs, this.mLs, this.mOas, this.mUs, this.mLbs);

    console.log('initializing AlphaTranslationService');
    this.mTs.init(
      this.mHttp,
      undefined,
      this.mLs.postErrorLog);

    console.log('initializing AlphaUploadService');
    this.mUs.init(
      this.mHttp,
      'uploadUrl',
      'deleteUploadUrl',
      this.mOas.authorize,
      this.mLs.postErrorLog);

  }

}
