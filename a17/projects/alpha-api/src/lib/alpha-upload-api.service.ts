import {Injectable} from '@angular/core';
import {Observable, Subscriber, of, mergeMap, catchError, throwError} from "rxjs";
import {AlphaHttpObjectResult, AlphaHttpResult, IAlphaHttpObjectResultDso} from "./alpha-http-result";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";

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

@Injectable({
  providedIn: 'root'
})
export class AlphaUploadApiService {

  private mContext = "AlphaUploadApiService";
  private mChunkSize = 3000000; // 3 Mb
  private mAuthorize!: (httpRequest: Observable<any>) => Observable<any>;
  private mPostErrorLog!: (context: string, method: string, error: string) => any;
  private mUploadUrl!: string;
  private mDeleteUploadUrl!: string;

  constructor(private mHttp: HttpClient) {
  }

  /**
   * Initializes the upload service with the specified parameters.
   *
   * @param {string} uploadUrl - The URL where the file should be uploaded to.
   * @param {string} deleteUploadUrl - The URL where the uploaded file should be deleted from.
   * @param {(obs: Observable<any>) => Observable<any>} authorize - The function that performs the authorization process for the upload.
   * @param {(context: string, method: string, error: string) => any} postErrorLog - The function that posts error logs.
   * @param {number} [chunkSize] - The optional size of each chunk to be uploaded. If not specified, a default value will be used.
   *
   * @return {void} - There is no return value.
   */
  init(
    uploadUrl: string,
    deleteUploadUrl: string,
    authorize: (obs: Observable<any>) => Observable<any>,
    postErrorLog: (context: string, method: string, error: string) => any,
    chunkSize?: number): void {
    this.mUploadUrl = uploadUrl;
    this.mDeleteUploadUrl = deleteUploadUrl;
    this.mAuthorize = authorize;
    this.mPostErrorLog = postErrorLog;
    if (chunkSize) {
      this.mChunkSize = chunkSize;
    }
  }

  /**
   * Uploads data to a specified URL.
   *
   * @param {*} data - The data to be uploaded.
   * @param {function} notifyProgress - A callback function to notify the progress of the upload.
   * @returns {Observable<string>} - An Observable that emits the id (uuid) of the upload entity created at server side as a string.
   */
  upload(
    data: any,
    notifyProgress: (progress: number) => any): Observable<string> {
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

  deleteUpload(
    uploadId: string): Observable<any> {
    const pId = encodeURIComponent(uploadId);
    const url = this.mDeleteUploadUrl
      + `?uploadId=${pId}`;

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
      this.mHttp.post<string>(this.mUploadUrl, body)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.mPostErrorLog(
              this.mContext, this.mUploadUrl, JSON.stringify(error));
            return throwError(() => error);
          }));
    return this.mAuthorize(call);
  }

}
