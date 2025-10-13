/**
 * IAlphaPage defines the structure for a page in the Alpha navigation system.
 *
 * Properties:
 * - parentRoute: The route towards the parent (usually a module)
 * - route: The route towards the page within a module
 * - area: Logical grouping for pages
 * - logRoute: Technical (breadcrumb) route for a given page
 * - logTitle: Functional name for a given page
 */
export interface IAlphaPage {
  /** The route towards the parent (usually a module). */
  parentRoute: string;
  /** The route towards the page within a module. */
  route: string;
  /** Area can be used for grouping pages. */
  area: string;
  /** Technical (breadcrumb) route for a given page. */
  logRoute: string;
  /** Functional name for a given page. */
  logTitle: string;
}

/**
 * AlphaPage is a concrete implementation of IAlphaPage, representing a navigable page in the Alpha system.
 *
 * Use this class to instantiate page objects for navigation, logging, and grouping.
 */
export class AlphaPage implements IAlphaPage {
  parentRoute: string;
  route: string;
  area: string;
  logRoute: string;
  logTitle: string;

  /**
   * Constructs an AlphaPage instance from an IAlphaPage configuration.
   *
   * @param pc The IAlphaPage configuration object.
   */
  constructor(
    pc: IAlphaPage) {
    this.parentRoute = pc.parentRoute;
    this.route = pc.route;
    this.area = pc.area;
    this.logRoute = pc.logRoute;
    this.logTitle = pc.logTitle;
  }
}
