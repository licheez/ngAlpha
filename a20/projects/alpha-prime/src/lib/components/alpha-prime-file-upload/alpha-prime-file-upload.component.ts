import {AfterViewInit, Component, computed, ElementRef, EventEmitter, input, Output, ViewChild} from '@angular/core';
import {IAlphaPrimeFileUpload} from './alpha-prime-file-upload';
import {AlphaPrimeService} from '../../services/alpha-prime.service';
import {InputText} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {InputGroup} from 'primeng/inputgroup';
import {Button} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {AlphaPrimeProgressBarComponent} from '../alpha-prime-progress-bar/alpha-prime-progress-bar.component';

class FormModel {
  fileName = '';
  fileData = '';

  get hasData(): boolean {
    return this.fileData.trim() !== '';
  }

  get invalid(): boolean {
    return this.fileName.trim() === '';
  }
}

class FileUpload implements IAlphaPrimeFileUpload {
  uploadId: string;
  fileName: string;
  fileData: string;

  constructor(
    uploadId: string,
    fileName: string,
    fileData: string) {
    this.uploadId = uploadId;
    this.fileName = fileName;
    this.fileData = fileData;
  }
}

@Component({
  selector: 'alpha-prime-file-upload',
  standalone: true,
  imports: [
    InputText,
    FormsModule,
    InputGroup,
    Button,
    Ripple,
    AlphaPrimeProgressBarComponent
  ],
  templateUrl: './alpha-prime-file-upload.component.html',
  styleUrl: './alpha-prime-file-upload.component.css'
})
export class AlphaPrimeFileUploadComponent implements AfterViewInit {

  name = input<string | undefined>();
  effectiveName(): string {
    return this.name() ?? this.mPs.generateRandomName()};

  accept = input<string | undefined>();

  // Normalize accept value: convert "*.pdf" to ".pdf" for HTML file input
  normalizedAccept = computed(() => {
    const acceptValue = this.accept();
    if (!acceptValue) return undefined;
    // If it starts with *. replace with just .
    if (acceptValue.startsWith('*.')) {
      return acceptValue.substring(1);
    }
    return acceptValue;
  });

  disabled = input<boolean>(false);
  /** when a new file is loaded it is automatically
   * uploaded to the Server
   */
  autoUpload = input<boolean>(true);
  deleteOnClear = input<boolean>(false);
  readonly  = input<boolean>(false);
  readonlyCaption = input<string>('');
  sm = input<boolean>(false);

  @ViewChild('fileInput', {static: false}) fileInput!: ElementRef<HTMLInputElement>;
  @Output() fileUploaded = new EventEmitter<IAlphaPrimeFileUpload>();
  @Output() fileDeleted = new EventEmitter<string>();
  /**
   * AfterViewInit will emit a delegate to the resetForm method
   * so that the parent component can invoke this method from
   * inside its own code */
  @Output() ready = new EventEmitter<()=>any>();

  busy = false;
  fm = new FormModel();
  fu: IAlphaPrimeFileUpload | undefined;
  uploading = false;
  progress = 0;

  fileLit: string;

  constructor(
    private mPs: AlphaPrimeService) {
    this.fileLit = mPs.getTr('alpha.common.file');
  }

  ngAfterViewInit() {
    this.ready.emit(() => this.resetForm());
  }

  private delete(uploadId: string): void {
    this.busy = true;
    this.mPs.deleteUpload(uploadId)
      .subscribe({
        next: () => {
          this.fileDeleted.emit(uploadId);
          this.busy = false;
        },
        error: e => {
          console.error(e);
          this.fu = undefined;
          this.busy = false;
        }
      });
  }

  private upload(): void {
    this.busy = true;
    this.uploading = true;
    this.progress = 0;
    this.mPs.upload(
      this.fm.fileData,
      progress => {
        this.progress = progress;
      }).subscribe({
      next: (uploadId: string) => {
        this.busy = false;
        setTimeout(() => {
          this.uploading = false;
        }, 2000);
        this.fu = new FileUpload(
          uploadId,
          this.fm.fileName,
          this.fm.fileData);
        this.fileUploaded.emit(this.fu);
      },
      error: (error) => {
        console.error(error);
        this.busy = false;
        this.uploading = false;
      }
    });
  }

  resetForm(): void {
    this.fm = new FormModel();
    this.uploading = false;
    this.progress = 0;
    this.fu = undefined
  }

  onFileInputChanged(changeEvent: Event) {
    try {
      this.busy = true;
      let reader: FileReader | undefined = new FileReader();

      reader.onload = (loadEvent: ProgressEvent) => {
        console.log('reader.onload', loadEvent);

        const target = loadEvent.target! as FileReader;
        // if (target == null) {
        //   throw new Error('target should not be null');
        // }
        this.fm.fileData = target.result as string;
        // dispose the reader
        setTimeout(() => reader = undefined, 10);
        this.busy = false;

        if (this.autoUpload()) {
          this.upload();
        }
      }

      reader.onerror = () => {
        this.resetForm();
        this.busy = false;
      }

      this.fm = new FormModel();
      const input = (changeEvent.target as HTMLInputElement)!;
      const file = input.files![0];
      // https://stackoverflow.com/questions/4109276/how-to-detect-input-type-file-change-for-the-same-file
      // reset the input value to empty string so that
      // the file change event will be raised again
      // with the same file
      input.value = '';
      if (!file) {
        this.busy = false;
        return;
      }
      this.fm.fileName = file.name;
      reader.readAsDataURL(file);
    } catch (error) {
      this.fm = new FormModel();
      console.error(error);
      this.busy = false;
    }
  }

  onBrowse() {
    if (this.fileInput == null) {
      throw new Error('fileInput should not be null');
    }
    this.fileInput.nativeElement.click();
  }

  onClear() {
    if (this.fu) {
      if (this.deleteOnClear()) {
        this.delete(this.fu.uploadId);
      }
    }
    this.resetForm();
  }

  onSave() {
    this.upload();
  }

}


