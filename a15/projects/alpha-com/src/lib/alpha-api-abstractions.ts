// noinspection JSUnusedGlobalSymbols

import {IAlphaOAuthService} from "./alpha-oas-abstractions";
import {IAlphaLoggerService} from "./alpha-ls-abstractions";
import {Observable} from "rxjs";

export interface IAlphaUploadApiService {
  /**
   * Initializes the AlphaUploadApiService.
   *
   * @param {string} uploadUrl - The URL for uploading files.
   * @param {string} deleteUploadUrl - The URL for deleting uploaded files.
   * @param {IAlphaOAuthService} oas - The OAuth service used for authentication.
   * @param {IAlphaLoggerService} ls - The logger service used for logging.
   * @param {number} [chunkSize] - The chunk size for splitting the file. If not specified, a default value will be used.
   *
   * @returns {void}
   */  init(
    uploadUrl: string,
    deleteUploadUrl: string,
    oas: IAlphaOAuthService,
    ls: IAlphaLoggerService,
    chunkSize?: number): void;

  /**
   * Uploads data to a specified URL.
   *
   * @param {*} data - The data to be uploaded.
   * @param {function} notifyProgress - A callback function to notify the progress of the upload.
   * @returns {Observable<string>} - An Observable that emits the id (uuid) of the upload entity created at server side as a string.
   */
  upload(
    data: any,
    notifyProgress: (progress: number) => any): Observable<string>;

  /**
   * Deletes an upload using the specified upload ID.
   *
   * @param {string} uploadId - The ID of the upload to delete.
   * @return {Observable<any>} - An observable that resolves with the response from the server when the upload is successfully deleted.
   * If an error occurs during the delete operation, the observable will emit an HttpErrorResponse object.
   */
  deleteUpload(
    uploadId: string): Observable<any>;
}

export interface IAlphaVersionApiService {
  /**
   * Initializes the application with the provided version URL and optional error logging function.
   *
   * @param {string} getVersionUrl - The URL to retrieve the version information from.
   * @param {IAlphaLoggerService} ls - The instance of the AlphaLoggerService to use for error logging (optional).
   * @return {void}
   */
  init(
    getVersionUrl: string,
    ls: IAlphaLoggerService):void;

  /** Inject your own getVersion method  */
  useGetVersion(getVersion: () => Observable<string>): void;

  /**
   * Retrieves the version number from a source.
   * @returns {Observable<string | null>} An observable that
   * emits the version number as a string or null if not available.
   */
  getVersion(): Observable<string | null>;
}
