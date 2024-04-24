import {IAlphaPage} from "@pvway/alpha-common";

export class AlphaPage implements IAlphaPage {
  parentRoute: string;
  route: string;
  area: string;
  logRoute: string;
  logTitle: string;

  constructor(
    pc: IAlphaPage) {
    this.parentRoute = pc.parentRoute;
    this.route = pc.route;
    this.area = pc.area;
    this.logRoute = pc.logRoute;
    this.logTitle = pc.logTitle;
  }
}
