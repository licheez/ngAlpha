// noinspection JSUnusedGlobalSymbols

/**
 * Interface for a logger service
 * that handles error and navigation logging.
 */
export interface IAlphaLoggerService {
  /**
   * Initialize the service with optional
   * error log and navigation log URLs.
   *
   * @param {string} [postErrorLogUrl] - The URL to which error logs will be posted.
   * @param {string} [postNavigationLogUrl] - The URL to which navigation logs will be posted.
   *
   * @return {void}
   */
  init(postErrorLogUrl?: string,
       postNavigationLogUrl?: string):void;

  /** Inject your own delegate for
   * posting navigation logs */
  usePostNavigationLog(
    postNavigationLog: (
      path: string, title: string) => any):void;

  /**
   * Posts the navigation log for a specific path and title.
   *
   * @param {string} path - The path of the navigation.
   * @param {string} title - The title of the navigation.
   * @return {void}
   */
  postNavigationLog(path: string, title: string): void;

  /** Inject your own delegate for posting errors */
  usePostErrorLog(
    postErrorLog: (
      context: string,
      method: string,
      error: string) => any): void;

  /**
   * Posts an error log with the given context, method, and error message.
   *
   * @param {string} context - The context in which the error occurred.
   * @param {string} method - The method or function where the error occurred.
   * @param {string} error - The error message or description.
   * @return {void}
   */
  postErrorLog(
    context: string,
    method: string,
    error: string): void;

}
