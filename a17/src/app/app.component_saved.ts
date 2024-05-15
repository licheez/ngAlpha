// import {Component, OnInit, Type} from '@angular/core';
// import {Router} from '@angular/router';
// import {AlphaLsService} from "../../projects/alpha-ls/src/lib/alpha-ls.service";
// import {AlphaLbsService} from "../../projects/alpha-lbs/src/lib/alpha-lbs.service";
// import {AlphaOasService} from "../../projects/alpha-oas/src/lib/alpha-oas.service";
// import {AlphaTsService} from "../../projects/alpha-ts/src/lib/alpha-ts.service";
// import {IAlphaPrincipal} from "../../projects/alpha-oas/src/lib/alpha-oas-abstractions";
// import {AlphaUploadApiService} from "../../projects/alpha-api/src/lib/alpha-upload-api.service";
// import {AlphaVersionApiService} from "../../projects/alpha-api/src/lib/alpha-version-api.service";
// import {AlphaEmsService} from "../../projects/alpha-ems/src/lib/alpha-ems.service";
// import {AlphaNsService} from "../../projects/alpha-ns/src/lib/alpha-ns.service";
// import {AlphaPrimeService} from "../../projects/alpha-prime/src/lib/services/alpha-prime.service";
// import {Observable} from "rxjs";
// import {AppSitemap} from "./app.sitemap";
// import {environment} from "../environments/environment";
// import {AlphaPrimeModalService} from "../../projects/alpha-prime/src/lib/services/alpha-prime-modal.service";
// import {DialogService, DynamicDialogModule} from "primeng/dynamicdialog";
// import {IAlphaPrimeModalConfig} from "../../projects/alpha-prime/src/lib/services/alpha-prime-modal-abstractions";
// import {IAlphaPage} from "../../projects/alpha-ns/src/lib/alpha-page";
//
// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.scss',
//   providers: [ DynamicDialogModule ]
// })
// export class AppComponent implements OnInit {
//
//   static readonly PRINCIPAL_UPDATED = "PrincipalUpdated";
//   static readonly PAGE_UPDATED = "PrincipalUpdated";
//   static readonly MODAL_STYLE_CLASS = 'iota-max-modal-width';
//
//   pendingInitCount = 2;
//   get ready(): boolean {
//     return this.pendingInitCount === 0;
//   }
//
//   title = 'a17';
//   offline = false;
//
//   constructor(
//     // API
//     private mUas: AlphaUploadApiService,
//     private mVas: AlphaVersionApiService,
//     // EMS
//     private mEms: AlphaEmsService,
//     // LBS
//     private mLbs: AlphaLbsService,
//     // LS
//     private mLs: AlphaLsService,
//     // NS
//     private mNs: AlphaNsService,
//     // OAS
//     private mOas: AlphaOasService,
//     // PRIME
//     private mMs: AlphaPrimeModalService,
//     private mPs: AlphaPrimeService,
//     // TS
//     private mTs: AlphaTsService,
//
//     // NG PRIME
//     private mDs: DialogService,
//
//     // OTHERS
//     private mRouter: Router) { }
//
//   ngOnInit() {
//     this.initAlpha();
//   }
//
//   private initAlpha(): void {
//
//     // DELEGATES for injection
//     // Translation service
//     const getTr:
//       (key: string, languageCode?: string) => string =
//       (key: string, languageCode?: string) =>
//         this.mTs.getTr(key, languageCode);
//
//     // LoggerService
//     const postErrorLog:
//       (context: string, method: string, error: string) => any =
//       (context: string, method: string, error: string) =>
//         this.mLs.postErrorLog(context, method, error);
//     const postNavigationLog:
//       (path: string, title: string) => any =
//       (path: string, title: string) =>
//         this.mLs.postNavigationLog(path, title);
//     const notifyNavigation:
//       (page: IAlphaPage) => any =
//       (page: IAlphaPage) =>
//         this.mLbs.publish(page, AppComponent.PAGE_UPDATED);
//
//     // OAuthService
//     const signIn:
//       (username: string, password: string, rememberMe: boolean) => Observable<boolean> =
//       (username: string, password: string, rememberMe: boolean) =>
//         this.mOas.signIn(username, password, rememberMe);
//     const authorize:
//       (httpRequest: Observable<any>) => Observable<any> =
//       (httpRequest: Observable<any>) =>
//         this.mOas.authorize(httpRequest);
//
//     // UploadService
//     const upload:
//       (data: any, notifyProgress: (progress: number) => any) => Observable<string> =
//       (data: any, notifyProgress: (progress: number) => any) =>
//         this.mUas.upload(data, notifyProgress);
//     const deleteUpload:
//       (uploadId: string) => Observable<any> =
//       (uploadId: string) =>
//         this.mUas.deleteUpload(uploadId);
//
//     // LocalBusService
//     const publish:
//       (payload: any, channel: string) => number =
//       (payload: any, channel: string) =>
//         this.mLbs.publish(payload, channel);
//     const subscribe:
//       (callback: (payload: any) => any, channel?: string) => number =
//       (callback: (payload: any) => any, channel?: string) =>
//         this.mLbs.subscribe(callback, channel);
//     const unsubscribe:
//       (subscriberId: number) => any =
//       (subscriberId: number) =>
//         this.mLbs.unsubscribe(subscriberId);
//     const dsOpen:
//       (component: Type<any>, config: IAlphaPrimeModalConfig) => any =
//       (component: Type<any>, config: IAlphaPrimeModalConfig) =>
//         this.mDs.open(component, config);
//
//     // ALPHA-PRIME
//     this.mPs.init(
//       false,
//       { getTr },
//       { postNavigationLog },
//       { signIn },
//       { upload, deleteUpload },
//       { publish, subscribe, unsubscribe });
//
//     this.mMs.init(
//       dsOpen, postNavigationLog,
//       AppComponent.MODAL_STYLE_CLASS);
//
//     // -- NAVIGATION
//     this.mNs.init(
//       this.mRouter,
//       AppSitemap.welcome,
//       postNavigationLog, notifyNavigation);
//
//     // UPLOAD
//     const uploadUrl = environment.apiHost + '/general/uploadChunk';
//     const deleteUploadUrl = environment.apiHost + '/general/deleteUpload';
//     this.mUas.init(
//       uploadUrl, deleteUploadUrl, authorize , postErrorLog);
//
//     // VERSION
//     const getVersionUrl = environment.apiHost + '/common/getVersion';
//     this.mVas.init(getVersionUrl, postErrorLog);
//
//     // TRANSLATIONS
//     const getTranslationCacheUpdateUrl = environment.apiHost
//       + '/general/getTranslationCacheUpdate';
//     this.mTs.init(
//       getTranslationCacheUpdateUrl,
//       postErrorLog).subscribe({
//       next: status => {
//         console.log(status);
//         this.pendingInitCount--;
//       },
//       error: e => {
//         this.pendingInitCount--;
//         console.error(e);
//         this.offline = true;
//       }
//     });
//
//     // AUTHENTICATION
//     const getMeUrl = environment.apiHost + '/token';
//     const refreshUrl = environment.apiHost + '/token';
//     const signInUrl = environment.apiHost + '/token';
//
//     const notifyPrincipalUpdates = (principal: IAlphaPrincipal) => {
//       this.mTs.changeLanguageCode(principal.languageCode);
//       this.mLbs.publish(principal, AppComponent.PRINCIPAL_UPDATED);
//     };
//     this.mOas.init(getMeUrl, refreshUrl, signInUrl,
//       postErrorLog, notifyPrincipalUpdates).subscribe({
//       next: status => {
//         console.log(status);
//         this.pendingInitCount--;
//       },
//       error: e => {
//         console.error(e);
//         this.pendingInitCount--;
//         this.offline = true;
//       }
//     });
//
//   }
//
//
// }
