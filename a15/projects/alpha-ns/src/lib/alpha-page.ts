export interface IAlphaPage {
  /** the route towards the parent (usually a module) */
  parentRoute: string;
  /** the route towards the page within a module */
  route: string;
  /** area can be used for grouping pages */
  area: string;
  /** technical (bread crumb) route for a given page */
  logRoute: string;
  /** functional name for a given page */
  logTitle: string;
}

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
