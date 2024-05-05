import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {PsComponent} from "./ps.component";
import {AppSitemap} from "../../app.sitemap";

import {PsHomePageComponent} from "./pages/ps-home-page/ps-home-page.component";
import {PsButtonsPageComponent} from "./pages/ps-buttons-page/ps-buttons-page.component";
import {PsModalsPageComponent} from "./pages/ps-modals-page/ps-modals-page.component";
import {PsScrollerPageComponent} from "./pages/ps-scroller-page/ps-scroller-page.component";

const routes: Routes = [
  {
    path: '', component: PsComponent,
    children: [
      {path: AppSitemap.psIntro.route, component: PsHomePageComponent},
      {path: AppSitemap.psButtons.route, component: PsButtonsPageComponent},
      {path: AppSitemap.psModals.route, component: PsModalsPageComponent},
      {path: AppSitemap.psScroller.route, component: PsScrollerPageComponent},
      {path: '**', redirectTo: AppSitemap.psIntro.route}
    ]
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class PsModule { }
