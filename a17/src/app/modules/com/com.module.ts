import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {ComComponent} from "./com.component";
import {AppSitemap} from "../../app.sitemap";
import {ComHomePageComponent} from "./pages/com-home-page/com-home-page.component";
import {EmsPageComponent} from "./ems/ems-page/ems-page.component";

const routes: Routes = [
  {
    path: '', component: ComComponent,
    children: [
      {path: AppSitemap.comIntro.route, component: ComHomePageComponent},
      {path: AppSitemap.comEms.route, component: EmsPageComponent},
      {path: '**', redirectTo: AppSitemap.comIntro.route}
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ComModule { }
