import {Injectable} from '@angular/core';
import {Observable, Subscriber, of, mergeMap, catchError, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {AlphaHttpObjectResult, IAlphaHttpObjectResultDso} from "../http/alpha-http-result";

class UsoChunkUpload {
  dataChunk: string;
  uploadId: string | undefined;

  constructor(
    dataChunk: string,
    uploadId?: string) {
    this.dataChunk = dataChunk;
    this.uploadId = uploadId;
  }
}

/**
 * Service for chunked file uploads and upload management.
 * Handles initialization, chunked uploads, progress notification, and error logging.
 * Designed for use with Angular HttpClient and RxJS.
 */
@Injectable({
  providedIn: 'root'
})
export class AlphaUploadApiService{

  private mHttp: HttpClient | undefined;
  private mContext = "AlphaUploadApiService";
  private mChunkSize = 3000000; // 3 Mb
  private mAuthorize!: (httpRequest: Observable<any>) => Observable<any>;
  private mPostErrorLog!: (context: string, method: string, error: string) => any;
  private mUploadUrl!: string;
  private mDeleteUploadUrl!: string;

  constructor() {
  }

  /**
   * Initializes the upload service with required dependencies and configuration.
   *
   * @param httpClient - Angular HttpClient instance for HTTP requests.
   * @param uploadUrl - The endpoint URL for file uploads.
   * @param deleteUploadUrl - The endpoint URL for deleting uploads.
   * @param authorize - Function to authorize HTTP requests.
   * @param postErrorLog - Function to log errors.
   * @param chunkSize - Optional chunk size in bytes for uploads (default: 3MB).
   */
  init(
    httpClient: HttpClient,
    uploadUrl: string,
    deleteUploadUrl: string,
    authorize: (httpRequest: Observable<any>) => Observable<any>,
    postErrorLog: (context: string, method: string, error: string) => any,
    chunkSize?: number): void {
    this.mHttp = httpClient;
    this.mUploadUrl = uploadUrl;
    this.mDeleteUploadUrl = deleteUploadUrl;
    this.mAuthorize = authorize;
    this.mPostErrorLog = postErrorLog;
    if (chunkSize) {
      this.mChunkSize = chunkSize;
    }
  }

  /**
   * Uploads data to the configured upload URL in chunks.
   *
   * @param data - The data object to be uploaded (serializable to JSON).
   * @param notifyProgress - Callback to notify upload progress (percentage).
   * @returns Observable emitting the upload entity ID (uuid) as a string.
   * @throws Error if the service is not initialized.
   */
  upload(
    data: any,
    notifyProgress: (progress: number) => any): Observable<string> {
    if (!this.mHttp){
      throw new Error('Service is not initialized');
    }
    return new Observable(
      (subscriber: Subscriber<string>) => {
        const chunks: string[] = [];
        const json = JSON.stringify(data);
        const len = json.length;
        for (let pos = 0; pos < len; pos += this.mChunkSize) {
          const chunk = json.substring(pos, pos + this.mChunkSize);
          chunks.push(chunk);
        }
        this._chainChunk(chunks, 0, notifyProgress)
          .subscribe({
            next: res => subscriber.next(res),
            error: error => subscriber.error(error)
          });
      });
  }

  /**
   * Deletes an upload by its ID.
   *
   * @param uploadId - The ID of the upload to delete.
   * @returns Observable resolving with the server response or emitting an HttpErrorResponse on error.
   * @throws Error if the service is not initialized.
   */
  deleteUpload(
    uploadId: string): Observable<any> {
    const pId = encodeURIComponent(uploadId);
    const url = this.mDeleteUploadUrl
      + `?uploadId=${pId}`;

    if (!this.mHttp){
      throw new Error('Service is not initialized');
    }

    const call = this.mHttp.get<any>(url)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.mPostErrorLog(this.mContext, url, JSON.stringify(error));
          return throwError(() => error);
        }));
    return this.mAuthorize(call);
  }

  private _chainChunk(
    chunks: string[],
    chunkIndex: number,
    notifyProgress: (progress: number) => any,
    uploadId?: string): Observable<string> {
    const len = chunks.length;
    let progress = 100 * (chunkIndex + 1) / len;
    progress = Math.ceil(progress);
    notifyProgress(progress);
    return this._uploadChunk(chunks[chunkIndex], uploadId)
      .pipe(
        mergeMap((dso: IAlphaHttpObjectResultDso | string) => {
          const isObjectResult = AlphaHttpObjectResult.isObjectResult(dso);
          let id: string;
          if (isObjectResult){
            id = AlphaHttpObjectResult.factorFromDso<string>(
              dso as IAlphaHttpObjectResultDso).data
          } else {
            id = dso as string;
          }
          if (chunkIndex === len - 1) {
            return of(id);
          } else {
            uploadId = id;
            return this._chainChunk(
              chunks, chunkIndex + 1, notifyProgress, id);
          }
        }));
  }

  private _uploadChunk(
    dataChunk: string,
    uploadId?: string): Observable<IAlphaHttpObjectResultDso | string> {
    const body = new UsoChunkUpload(dataChunk, uploadId);
    const call =
      this.mHttp!.post<string>(this.mUploadUrl, body)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.mPostErrorLog(
              this.mContext, this.mUploadUrl, JSON.stringify(error));
            return throwError(() => error);
          }));
    return this.mAuthorize(call);
  }

}
