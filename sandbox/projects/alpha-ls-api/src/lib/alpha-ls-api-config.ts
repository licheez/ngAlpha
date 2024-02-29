export interface IAlphaLsApiConfig
{
  postNavigationLogUrl: string | null;
  postErrorLogUrl: string | null;
}

export class AlphaLsApiConfig implements IAlphaLsApiConfig{
  postNavigationLogUrl: string | null;
  postErrorLogUrl: string | null;

  constructor(config: IAlphaLsApiConfig) {
    this.postNavigationLogUrl = config.postNavigationLogUrl;
    this.postErrorLogUrl = config.postErrorLogUrl;
  }

}
