# AlphaPrime

## Description

This is an Angular Service that provides functionalities for handling modals in your application.

## How to initialize the service

Before being able to open a modal, the service needs to be initialized by calling the `init` method.

```typescript
  /**
 * Initializes the dialog service.
 *
 * @param {DialogService} ds - The DialogService object to be initialized.
 * @param {(path: string, title: string) => any} postNavigationLog - The function used for posting navigation logs, with parameters path: string and title: string.
 * @param {string} [modalStyleClass] - Optional. The CSS class to be applied to the modals created by the DialogService.
 * @return {void}
 */
init(
  ds: DialogService,
  postNavigationLog: (path: string, title: string) => any,
  modalStyleClass?: string): void
```
## Open a modal

You can open a modal by calling the `openModal` method.

```typescript
  /**
 * Opens a modal dialog.
 *
 * @template T - The type of the component to be opened in the modal.
 *
 * @param {Type<T>} component - The component to be opened in the modal.
 * @param {string} anchor - The name of the component calling the openModal method.
 * @param {string} modal - The name of the modal.
 * @param {DynamicDialogConfig} [ddc] - Optional configuration for the modal dialog.
 *
 * @return {Observable<T>} - An Observable that emits an instance of the opened component when the modal is displayed.
 *                           If an error occurs during the opening of the modal, the Observable will emit an error instead.
 */
openModal<T>(
  component: Type<T>,
  anchor: string,
  modal: string,
  ddc?: DynamicDialogConfig): Observable<T>
```
This service uses Angular's dependency Injection system to work properly and utilise Primeng's DialogService to display modals. It also emits an Observable carrying the instance of the opened modal.

## Usage
### initialization
```typescript
...

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DialogService]
})
export class AppComponent implements OnInit {

  constructor(
    // PRIME
    private mDs: DialogService,
    // MODAL
    private mPms: AlphaPrimeModalService,
    private mLbs: AlphaLbsService,
    // LOGGER
    private mLs: AlphaLsService) {
  }

  ngOnInit(): void {

    // LOGGING 
    const postNavLog = (path: string, title: string) =>
      this.mLs.postNavigationLog(path, title);

    // MODAL
    this.mPms.init(this.mDs, postNavLog, 'iota-max-modal-width');
  }
}
```
### Opening a modal from an app component
```typescript
  onLogin(): void {
    this.modalService.openModal(
      UamLoginModalComponent,      // the component that will open into the modal
      'welcomePage', // the component that opens the modal 
      'UamLogin') // the friendy name of the component to open in the modal
      .subscribe( 
        // when the modal is fully displayed
        // we get its instance
        // here we call the init method
        modal => modal.init(
          true,
          () => { /* the code that will be called when the modal terminates */ }));
  }

```
