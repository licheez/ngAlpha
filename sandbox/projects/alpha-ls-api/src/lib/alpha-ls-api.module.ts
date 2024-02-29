import {ModuleWithProviders, NgModule} from '@angular/core';
import {AlphaLsApiConfig, IAlphaLsApiConfig} from "./alpha-ls-api-config";

@NgModule()
export class AlphaLsApiModule {
  static forRoot(
    lsApiConfig: IAlphaLsApiConfig): ModuleWithProviders<AlphaLsApiModule> {
    return {
      ngModule: AlphaLsApiModule,
      providers: [
        { provide: AlphaLsApiConfig, useValue: lsApiConfig }
      ]
    };
  }
}
