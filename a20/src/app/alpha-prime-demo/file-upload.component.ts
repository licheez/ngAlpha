import {Component} from '@angular/core';
import {AlphaPrimeFileUploadComponent}
  from '../../../projects/alpha-prime/src/lib/components/alpha-prime-file-upload/alpha-prime-file-upload.component';
import {
  IAlphaPrimeFileUpload
} from '../../../projects/alpha-prime/src/lib/components/alpha-prime-file-upload/alpha-prime-file-upload';

@Component({
  selector: 'app-file-upload',
  template: `
    <section>
      <h2>File Upload Component</h2>
      <form>
        <alpha-prime-file-upload
          [accept]="'.pdf'"
          [autoUpload]="false"
          (fileUploaded)="onFileUploaded($event)"
          (fileDeleted)="onFileDeleted($event)"
        ></alpha-prime-file-upload>
      </form>
    </section>
  `,
  imports: [
    AlphaPrimeFileUploadComponent
  ]
})
export class FileUploadComponent {

  onFileUploaded(fu: IAlphaPrimeFileUpload): void {
    console.log('File uploaded:', fu.uploadId);
  }
  onFileDeleted(name: string): void {
    console.log('File deleted:', name);
  }
}
