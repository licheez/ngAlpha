import {AlphaEmsBaseApi} from "./alpha-ems-base-api";
import {AlphaEmsFormInput} from "./alpha-ems-form-input";
import {Observable, Subscriber} from "rxjs";
import {AlphaEmsFormResult} from "./alpha-ems-form-result";
import {AlphaEmsBaseFormModel} from "./alpha-ems-base-form-model";

export abstract class AlphaEmsBaseComponent<TH, TB, TE> {
  busy = false;

  protected verbose = false;
  protected api: AlphaEmsBaseApi<TH, TB, TE>;
  private _fi!: AlphaEmsFormInput<TB>;
  private allowAnonymousRead = true;

  /**
   *
   * @param api the genApi service providing the necessary methods
   * @param mFactorForm a factory method that build the form model
   * @param allowAnonymousRead whether or not read is allowed for anonymous (default is true)
   */
  constructor(
    api: AlphaEmsBaseApi<TH, TB, TE>,
    private mFactorForm: () =>
      AlphaEmsBaseFormModel<TH, TB, TE>,
    allowAnonymousRead?: boolean) {
    this.api = api;
    if (allowAnonymousRead !== undefined) {
      this.allowAnonymousRead = allowAnonymousRead;
    }
  }

  /**
   * Loads the form based on the mode (read, edit or new) set in GenFormInput.
   * Also sets the value fi within the form just before calling the appropriate populate method.
   * @param {AlphaEmsFormInput} fi - The AlphaGenFormInput object containing the form mode and options.
   * @returns {Observable} - An observable of the generic form that should be casted to the concrete form.
   */
  protected loadForm(fi: AlphaEmsFormInput<TB>):
    Observable<AlphaEmsBaseFormModel<TH, TB, TE>> {
    this._fi = fi;
    switch (fi.mode) {
      case 'read':
        return this.loadForRead(fi.keys!, fi.options)
      case 'new':
        return this.loadForNew(fi.options)
      case 'edit':
        return this.loadForEdit(fi.keys!, fi.options);
    }
  }

  private loadForRead(keys: string[], options?: Map<string, string>):
    Observable<AlphaEmsBaseFormModel<TH, TB, TE>> {
    return new Observable(
      (subscriber: Subscriber<AlphaEmsBaseFormModel<TH, TB, TE>>) => {
        if (this._fi.body !== undefined) {
          const fm =
            this.factorForm();
          fm.populateForRead(this._fi.body);
          fm.body = this._fi.body;
          subscriber.next(fm);
        } else {
          this.busy = true;
          this.api.getBody(!this.allowAnonymousRead, keys, options)
            .subscribe({
              next: body => {
                if (this.verbose) {
                  console.log(body);
                }
                const fm =
                  this.factorForm();
                fm.populateForRead(body);
                fm.body = body;
                this.busy = false;
                subscriber.next(fm);
              },
              error: error => {
                console.error(error);
                this.busy = false;
                subscriber.error(error);
              }
            });
        }
      });
  }

  private loadForNew(options?: Map<string, string>): Observable<AlphaEmsBaseFormModel<TH, TB, TE>> {

    return new Observable(
      (subscriber: Subscriber<AlphaEmsBaseFormModel<TH, TB, TE>>) => {
        this.busy = true;
        this.api.getEi(options)
          .subscribe({
            next: ei => {
              if (this.verbose) {
                console.log(ei);
              }
              const fm =
                this.factorForm();
              fm.populateForNew(ei);
              fm.ei = ei;
              this.busy = false;
              subscriber.next(fm);
            },
            error: error => {
              console.error(error);
              this.busy = false;
              subscriber.error(error);
            }
          });
      });

  }

  private loadForEdit(keys: string[], options?: Map<string, string>):
    Observable<AlphaEmsBaseFormModel<TH, TB, TE>> {
    return new Observable(
      (subscriber: Subscriber<AlphaEmsBaseFormModel<TH, TB, TE>>) => {
        this.busy = true;
        this.api.getBodyFe(keys, options)
          .subscribe({
            next: ec => {
              if (this.verbose) {
                console.log(ec);
              }
              const fm =
                this.factorForm();
              fm.populateForEdit(ec.ei, ec.body!);
              fm.ei = ec.ei;
              fm.body = ec.body;
              this.busy = false;
              subscriber.next(fm);
            },
            error: error => {
              console.error(error);
              this.busy = false;
              subscriber.error(error);
            }
          });
      });
  }

  /** saves the form by calling fm.updateEntity or fm.createEntity and
   * returns an observable with the GenFormResult<TB>.
   * This method manages the busy state
   */
  protected save(
    fm: AlphaEmsBaseFormModel<TH, TB, TE>): Observable<AlphaEmsFormResult<TB>> {

    return new Observable(
      (subscriber: Subscriber<AlphaEmsFormResult<TB>>) => {
        let apiCall: Observable<TB>
        let action: 'C' | 'U';
        switch (this._fi.mode) {
          case 'read':
            const r = new AlphaEmsFormResult<TB>('R');
            subscriber.next(r);
            return;
          case 'edit':
            action = 'U';
            apiCall = fm.updateEntity();
            break;
          case 'new':
            action = 'C';
            apiCall = fm.createEntity();
            break;
        }

        this.busy = true;
        apiCall.subscribe({
          next: b => {
            const res = new AlphaEmsFormResult<TB>(
              action, b);
            this.busy = false;
            subscriber.next(res);
          },
          error: error => {
            console.error(error);
            this.busy = false;
            subscriber.error(error);
          }
        });
      });
  }

  protected delete(options?: Map<string, string>): Observable<AlphaEmsFormResult<TB>> {
    return new Observable(
      (subscriber: Subscriber<AlphaEmsFormResult<TB>>) => {
        this.busy = true;
        this.api.delete(this._fi.keys!, options)
          .subscribe({
            next: bodyWhenSoftDeleted => {
              const res = bodyWhenSoftDeleted
                ? new AlphaEmsFormResult<TB>('U', bodyWhenSoftDeleted)
                : new AlphaEmsFormResult<TB>('D');
              subscriber.next(res);
              this.busy = false;
            },
            error: error => {
              console.error(error);
              subscriber.error(error);
              this.busy = false;
            }
          });
      });
  }

  private factorForm(): AlphaEmsBaseFormModel<TH, TB, TE> {
    const fm = this.mFactorForm();
    fm.api = this.api;
    fm.fi = this._fi;
    return fm;
  }


}
