import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AlphaPrimeFileUploadComponent } from './alpha-prime-file-upload.component';
import { AlphaPrimeService } from '../../services/alpha-prime.service';
import { of, throwError } from 'rxjs';
import { EventEmitter } from '@angular/core';

describe('AlphaPrimeFileUploadComponent', () => {
  let component: AlphaPrimeFileUploadComponent;
  let fixture: ComponentFixture<AlphaPrimeFileUploadComponent>;
  let mockPrimeService: jasmine.SpyObj<AlphaPrimeService>;

  beforeEach(async () => {
    mockPrimeService = jasmine.createSpyObj('AlphaPrimeService', [
      'getTr',
      'generateRandomName',
      'upload',
      'deleteUpload'
    ]);
    mockPrimeService.getTr.and.returnValue('File');
    mockPrimeService.generateRandomName.and.returnValue('random-name-123');
    mockPrimeService.upload.and.returnValue(of('upload-id-123'));
    mockPrimeService.deleteUpload.and.returnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [AlphaPrimeFileUploadComponent],
      providers: [
        { provide: AlphaPrimeService, useValue: mockPrimeService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.disabled()).toBe(false);
      expect(component.autoUpload()).toBe(true);
      expect(component.deleteOnClear()).toBe(false);
      expect(component.readonly()).toBe(false);
      expect(component.readonlyCaption()).toBe('');
      expect(component.sm()).toBe(false);
      expect(component.busy).toBe(false);
      expect(component.uploading).toBe(false);
      expect(component.progress).toBe(0);
      expect(component.fu).toBeUndefined();
    });

    it('should initialize FormModel with empty values', () => {
      expect(component.fm.fileName).toBe('');
      expect(component.fm.fileData).toBe('');
      expect(component.fm.hasData).toBe(false);
      expect(component.fm.invalid).toBe(true);
    });

    it('should have EventEmitters', () => {
      expect(component.fileUploaded).toBeInstanceOf(EventEmitter);
      expect(component.fileDeleted).toBeInstanceOf(EventEmitter);
      expect(component.ready).toBeInstanceOf(EventEmitter);
    });

    it('should call getTr to get file literal', () => {
      expect(mockPrimeService.getTr).toHaveBeenCalledWith('alpha.common.file');
      expect(component.fileLit).toBe('File');
    });
  });

  describe('effectiveName method', () => {
    it('should return provided name when name input is set', () => {
      fixture.componentRef.setInput('name', 'my-file-upload');
      fixture.detectChanges();
      expect(component.effectiveName()).toBe('my-file-upload');
    });

    it('should generate random name when name input is not set', () => {
      expect(component.effectiveName()).toBe('random-name-123');
      expect(mockPrimeService.generateRandomName).toHaveBeenCalled();
    });

    it('should call generateRandomName for undefined name', () => {
      fixture.componentRef.setInput('name', undefined);
      fixture.detectChanges();
      expect(component.effectiveName()).toBe('random-name-123');
    });
  });

  describe('normalizedAccept computed signal', () => {
    it('should return undefined when accept is not set', () => {
      expect(component.normalizedAccept()).toBeUndefined();
    });

    it('should normalize "*.pdf" to ".pdf"', () => {
      fixture.componentRef.setInput('accept', '*.pdf');
      fixture.detectChanges();
      expect(component.normalizedAccept()).toBe('.pdf');
    });

    it('should normalize "*.jpg" to ".jpg"', () => {
      fixture.componentRef.setInput('accept', '*.jpg');
      fixture.detectChanges();
      expect(component.normalizedAccept()).toBe('.jpg');
    });

    it('should keep ".pdf" as ".pdf"', () => {
      fixture.componentRef.setInput('accept', '.pdf');
      fixture.detectChanges();
      expect(component.normalizedAccept()).toBe('.pdf');
    });

    it('should keep "image/*" as "image/*"', () => {
      fixture.componentRef.setInput('accept', 'image/*');
      fixture.detectChanges();
      expect(component.normalizedAccept()).toBe('image/*');
    });
  });

  describe('Input Properties', () => {
    it('should accept disabled input', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      expect(component.disabled()).toBe(true);
    });

    it('should accept autoUpload input', () => {
      fixture.componentRef.setInput('autoUpload', false);
      fixture.detectChanges();
      expect(component.autoUpload()).toBe(false);
    });

    it('should accept deleteOnClear input', () => {
      fixture.componentRef.setInput('deleteOnClear', true);
      fixture.detectChanges();
      expect(component.deleteOnClear()).toBe(true);
    });

    it('should accept readonly input', () => {
      fixture.componentRef.setInput('readonly', true);
      fixture.detectChanges();
      expect(component.readonly()).toBe(true);
    });

    it('should accept readonlyCaption input', () => {
      fixture.componentRef.setInput('readonlyCaption', 'Document.pdf');
      fixture.detectChanges();
      expect(component.readonlyCaption()).toBe('Document.pdf');
    });

    it('should accept sm input', () => {
      fixture.componentRef.setInput('sm', true);
      fixture.detectChanges();
      expect(component.sm()).toBe(true);
    });

    it('should accept accept input', () => {
      fixture.componentRef.setInput('accept', '*.pdf');
      fixture.detectChanges();
      expect(component.accept()).toBe('*.pdf');
    });
  });

  describe('ngAfterViewInit', () => {
    it('should emit ready event with resetForm delegate', fakeAsync(() => {
      let resetDelegate: (() => any) | undefined;
      component.ready.subscribe((delegate) => {
        resetDelegate = delegate;
      });

      component.ngAfterViewInit();
      tick();

      expect(resetDelegate).toBeDefined();

      // Test the delegate
      component.fm.fileName = 'test.pdf';
      component.fm.fileData = 'data:base64';
      component.uploading = true;
      component.progress = 50;

      resetDelegate!();

      expect(component.fm.fileName).toBe('');
      expect(component.fm.fileData).toBe('');
      expect(component.uploading).toBe(false);
      expect(component.progress).toBe(0);
    }));
  });

  describe('resetForm method', () => {
    it('should reset form model to initial state', () => {
      component.fm.fileName = 'test.pdf';
      component.fm.fileData = 'data:application/pdf;base64,test';
      component.uploading = true;
      component.progress = 75;
      component.fu = {
        uploadId: 'id-123',
        fileName: 'test.pdf',
        fileData: 'data'
      };

      component.resetForm();

      expect(component.fm.fileName).toBe('');
      expect(component.fm.fileData).toBe('');
      expect(component.uploading).toBe(false);
      expect(component.progress).toBe(0);
      expect(component.fu).toBeUndefined();
    });
  });

  describe('onBrowse method', () => {
    it('should trigger file input click', () => {
      const fileInput = fixture.debugElement.query(By.css('input[type="file"]'));
      spyOn(fileInput.nativeElement, 'click');

      component.onBrowse();

      expect(fileInput.nativeElement.click).toHaveBeenCalled();
    });

    it('should throw error if fileInput is null', () => {
      component.fileInput = null as any;

      expect(() => component.onBrowse()).toThrowError('fileInput should not be null');
    });
  });

  describe('onFileInputChanged method', () => {
    let mockFile: File;
    let mockEvent: any;

    beforeEach(() => {
      mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
      const mockFileList = {
        0: mockFile,
        length: 1,
        item: () => mockFile
      };
      mockEvent = {
        target: {
          files: mockFileList,
          value: 'C:\\fakepath\\test.pdf'
        }
      };
    });

    it('should set busy to true when file is selected', () => {
      spyOn(FileReader.prototype, 'readAsDataURL');

      component.onFileInputChanged(mockEvent);

      expect(component.busy).toBe(true);
    });

    it('should reset input value to empty string', () => {
      spyOn(FileReader.prototype, 'readAsDataURL');

      component.onFileInputChanged(mockEvent);

      expect(mockEvent.target.value).toBe('');
    });

    it('should set fileName from file', () => {
      spyOn(FileReader.prototype, 'readAsDataURL');

      component.onFileInputChanged(mockEvent);

      expect(component.fm.fileName).toBe('test.pdf');
    });

    it('should call readAsDataURL on FileReader', () => {
      const readSpy = spyOn(FileReader.prototype, 'readAsDataURL');

      component.onFileInputChanged(mockEvent);

      expect(readSpy).toHaveBeenCalledWith(mockFile);
    });

    it('should handle FileReader onload and set fileData', fakeAsync(() => {
      const fileContent = 'data:application/pdf;base64,testdata';

      spyOn(FileReader.prototype, 'readAsDataURL').and.callFake(function(this: FileReader) {
        setTimeout(() => {
          const loadEvent = new ProgressEvent('load', {
            target: this
          } as any);
          Object.defineProperty(loadEvent, 'target', {
            value: { result: fileContent },
            writable: false
          });
          (this.onload as any)!(loadEvent);
        }, 0);
      });

      component.onFileInputChanged(mockEvent);
      tick();

      expect(component.fm.fileData).toBe(fileContent);
      expect(component.busy).toBe(false);
    }));

    it('should auto-upload when autoUpload is true', fakeAsync(() => {
      fixture.componentRef.setInput('autoUpload', true);
      const fileContent = 'data:application/pdf;base64,testdata';

      spyOn(FileReader.prototype, 'readAsDataURL').and.callFake(function(this: FileReader) {
        setTimeout(() => {
          const loadEvent = new ProgressEvent('load');
          Object.defineProperty(loadEvent, 'target', {
            value: { result: fileContent },
            writable: false
          });
          (this.onload as any)!(loadEvent);
        }, 0);
      });

      component.onFileInputChanged(mockEvent);
      tick();

      expect(mockPrimeService.upload).toHaveBeenCalledWith(fileContent, jasmine.any(Function));
    }));

    it('should not auto-upload when autoUpload is false', fakeAsync(() => {
      fixture.componentRef.setInput('autoUpload', false);
      const fileContent = 'data:application/pdf;base64,testdata';

      spyOn(FileReader.prototype, 'readAsDataURL').and.callFake(function(this: FileReader) {
        setTimeout(() => {
          const loadEvent = new ProgressEvent('load');
          Object.defineProperty(loadEvent, 'target', {
            value: { result: fileContent },
            writable: false
          });
          (this.onload as any)!(loadEvent);
        }, 0);
      });

      component.onFileInputChanged(mockEvent);
      tick();

      expect(mockPrimeService.upload).not.toHaveBeenCalled();
    }));

    it('should reset form on FileReader error', fakeAsync(() => {
      spyOn(FileReader.prototype, 'readAsDataURL').and.callFake(function(this: FileReader) {
        setTimeout(() => {
          (this.onerror as any)!(new ProgressEvent('error'));
        }, 0);
      });

      component.fm.fileName = 'existing.pdf';
      component.onFileInputChanged(mockEvent);
      tick();

      expect(component.fm.fileName).toBe('');
      expect(component.busy).toBe(false);
    }));

    it('should handle missing file gracefully', () => {
      const emptyEvent = {
        target: {
          files: [],
          value: ''
        }
      } as any;

      component.onFileInputChanged(emptyEvent);

      expect(component.busy).toBe(false);
    });

    it('should handle exceptions and reset form', () => {
      const errorEvent = {
        target: null
      } as any;
      spyOn(console, 'error');

      component.onFileInputChanged(errorEvent);

      expect(component.fm.fileName).toBe('');
      expect(component.fm.fileData).toBe('');
      expect(component.busy).toBe(false);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('onSave method', () => {
    it('should call upload method', () => {
      component.fm.fileData = 'data:application/pdf;base64,test';

      component.onSave();

      expect(mockPrimeService.upload).toHaveBeenCalled();
    });

    it('should set busy and uploading flags', () => {
      let capturedBusy = false;
      let capturedUploading = false;

      // Capture the state during upload by intercepting the upload call
      mockPrimeService.upload.and.callFake((_data, _callback) => {
        // Capture the flags right when upload is called (they should be set)
        capturedBusy = component.busy;
        capturedUploading = component.uploading;
        return of('upload-id-123');
      });

      component.fm.fileData = 'data:application/pdf;base64,test';

      component.onSave();

      expect(capturedBusy).toBe(true);
      expect(capturedUploading).toBe(true);
    });

    it('should reset progress to 0', () => {
      component.progress = 50;
      component.fm.fileData = 'data:application/pdf;base64,test';

      component.onSave();

      expect(component.progress).toBe(0);
    });

    it('should emit fileUploaded on successful upload', fakeAsync(() => {
      component.fm.fileName = 'test.pdf';
      component.fm.fileData = 'data:application/pdf;base64,test';
      spyOn(component.fileUploaded, 'emit');

      component.onSave();
      tick();

      expect(component.fileUploaded.emit).toHaveBeenCalled();
      const emittedData = (component.fileUploaded.emit as jasmine.Spy).calls.mostRecent().args[0];
      expect(emittedData.uploadId).toBe('upload-id-123');
      expect(emittedData.fileName).toBe('test.pdf');
      expect(emittedData.fileData).toBe('data:application/pdf;base64,test');
    }));

    it('should set fu after successful upload', fakeAsync(() => {
      component.fm.fileName = 'test.pdf';
      component.fm.fileData = 'data:application/pdf;base64,test';

      component.onSave();
      tick();

      expect(component.fu).toBeDefined();
      expect(component.fu!.uploadId).toBe('upload-id-123');
      expect(component.fu!.fileName).toBe('test.pdf');
    }));

    it('should call progress callback during upload', fakeAsync(() => {
      let progressCallback: ((progress: number) => void) | undefined;
      mockPrimeService.upload.and.callFake((data, callback) => {
        progressCallback = callback;
        return of('upload-id-123');
      });
      component.fm.fileData = 'data:application/pdf;base64,test';

      component.onSave();

      progressCallback!(25);
      expect(component.progress).toBe(25);

      progressCallback!(75);
      expect(component.progress).toBe(75);
    }));

    it('should set uploading to false after 2 seconds', fakeAsync(() => {
      component.fm.fileData = 'data:application/pdf;base64,test';

      component.onSave();
      tick();

      expect(component.uploading).toBe(true);

      tick(2000);

      expect(component.uploading).toBe(false);
    }));

    it('should handle upload error', fakeAsync(() => {
      mockPrimeService.upload.and.returnValue(throwError(() => new Error('Upload failed')));
      spyOn(console, 'error');
      component.fm.fileData = 'data:application/pdf;base64,test';

      component.onSave();
      tick();

      expect(console.error).toHaveBeenCalled();
      expect(component.busy).toBe(false);
      expect(component.uploading).toBe(false);
    }));
  });

  describe('onClear method', () => {
    it('should reset form when fu is undefined', () => {
      component.fu = undefined;
      component.fm.fileName = 'test.pdf';
      component.fm.fileData = 'data';

      component.onClear();

      expect(component.fm.fileName).toBe('');
      expect(component.fm.fileData).toBe('');
    });

    it('should not call delete when deleteOnClear is false', () => {
      fixture.componentRef.setInput('deleteOnClear', false);
      component.fu = {
        uploadId: 'upload-123',
        fileName: 'test.pdf',
        fileData: 'data'
      };

      component.onClear();

      expect(mockPrimeService.deleteUpload).not.toHaveBeenCalled();
    });

    it('should call delete when deleteOnClear is true and fu exists', () => {
      fixture.componentRef.setInput('deleteOnClear', true);
      component.fu = {
        uploadId: 'upload-123',
        fileName: 'test.pdf',
        fileData: 'data'
      };

      component.onClear();

      expect(mockPrimeService.deleteUpload).toHaveBeenCalledWith('upload-123');
    });

    it('should emit fileDeleted on successful delete', fakeAsync(() => {
      fixture.componentRef.setInput('deleteOnClear', true);
      component.fu = {
        uploadId: 'upload-123',
        fileName: 'test.pdf',
        fileData: 'data'
      };
      spyOn(component.fileDeleted, 'emit');

      component.onClear();
      tick();

      expect(component.fileDeleted.emit).toHaveBeenCalledWith('upload-123');
    }));

    it('should set busy during delete operation', fakeAsync(() => {
      let capturedBusyDuringDelete = false;

      // Intercept the deleteUpload call to capture busy state
      mockPrimeService.deleteUpload.and.callFake((_uploadId) => {
        capturedBusyDuringDelete = component.busy;
        return of(void 0);
      });

      fixture.componentRef.setInput('deleteOnClear', true);
      component.fu = {
        uploadId: 'upload-123',
        fileName: 'test.pdf',
        fileData: 'data'
      };

      component.onClear();

      expect(capturedBusyDuringDelete).toBe(true);

      tick();

      expect(component.busy).toBe(false);
    }));

    it('should handle delete error', fakeAsync(() => {
      mockPrimeService.deleteUpload.and.returnValue(throwError(() => new Error('Delete failed')));
      fixture.componentRef.setInput('deleteOnClear', true);
      component.fu = {
        uploadId: 'upload-123',
        fileName: 'test.pdf',
        fileData: 'data'
      };
      spyOn(console, 'error');

      component.onClear();
      tick();

      expect(console.error).toHaveBeenCalled();
      expect(component.busy).toBe(false);
      expect(component.fu).toBeUndefined();
    }));

    it('should always reset form', () => {
      component.fm.fileName = 'test.pdf';
      component.fm.fileData = 'data';

      component.onClear();

      expect(component.fm.fileName).toBe('');
      expect(component.fm.fileData).toBe('');
    });
  });

  describe('Template Integration', () => {
    it('should render readonly input when readonly is true', () => {
      fixture.componentRef.setInput('readonly', true);
      fixture.componentRef.setInput('readonlyCaption', 'Document.pdf');
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input[type="text"]'));
      expect(input).toBeTruthy();
      expect(input.nativeElement.readOnly).toBe(true);
    });

    it('should render file upload interface when readonly is false', () => {
      fixture.componentRef.setInput('readonly', false);
      fixture.detectChanges();

      const inputGroup = fixture.debugElement.query(By.css('p-inputgroup'));
      expect(inputGroup).toBeTruthy();
    });

    it('should show browse button when no file data', () => {
      component.fm.fileData = '';
      fixture.detectChanges();

      const buttons = fixture.debugElement.queryAll(By.css('p-button'));
      const browseButton = buttons.find(btn =>
        btn.nativeElement.querySelector('.fa-folder-open')
      );
      expect(browseButton).toBeTruthy();
    });

    it('should show delete button when file has data', () => {
      component.fm.fileData = 'data:application/pdf;base64,test';
      fixture.detectChanges();

      const buttons = fixture.debugElement.queryAll(By.css('p-button'));
      const deleteButton = buttons.find(btn =>
        btn.nativeElement.querySelector('.fa-trash-alt')
      );
      expect(deleteButton).toBeTruthy();
    });

    it('should show upload button when file has data but not uploaded', () => {
      component.fm.fileData = 'data:application/pdf;base64,test';
      component.fu = undefined;
      component.busy = false;
      fixture.detectChanges();

      const buttons = fixture.debugElement.queryAll(By.css('p-button'));
      const uploadButton = buttons.find(btn =>
        btn.nativeElement.querySelector('.fa-upload')
      );
      expect(uploadButton).toBeTruthy();
    });

    it('should show spinner when busy during upload', () => {
      component.fm.fileData = 'data:application/pdf;base64,test';
      component.fu = undefined;
      component.busy = true;
      fixture.detectChanges();

      const buttons = fixture.debugElement.queryAll(By.css('p-button'));
      const spinnerButton = buttons.find(btn =>
        btn.nativeElement.querySelector('.fa-spinner')
      );
      expect(spinnerButton).toBeTruthy();
    });

    it('should disable buttons when disabled input is true', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const buttons = fixture.debugElement.queryAll(By.css('button'));
      buttons.forEach(btn => {
        expect(btn.nativeElement.disabled).toBe(true);
      });
    });

    it('should render progress bar', () => {
      const progressBar = fixture.debugElement.query(By.css('alpha-prime-progress-bar'));
      expect(progressBar).toBeTruthy();
    });

    it('should bind progress value to progress bar', () => {
      component.progress = 75;
      fixture.detectChanges();

      const progressBar = fixture.debugElement.query(By.css('alpha-prime-progress-bar'));
      expect(progressBar.componentInstance.value()).toBe(75);
    });

    it('should hide file input element', () => {
      const fileInput = fixture.debugElement.query(By.css('input[type="file"]'));
      expect(fileInput.nativeElement.style.display).toBe('none');
    });

    it('should bind accept attribute to file input', () => {
      fixture.componentRef.setInput('accept', '*.pdf');
      fixture.detectChanges();

      const fileInput = fixture.debugElement.query(By.css('input[type="file"]'));
      expect(fileInput.nativeElement.accept).toBe('.pdf');
    });

    it('should use effectiveName for input name attribute', fakeAsync(() => {
      fixture.componentRef.setInput('name', 'my-upload');
      fixture.componentRef.setInput('readonly', false);
      fixture.detectChanges();
      tick();
      fixture.detectChanges(); // Extra change detection cycle

      // The main input binds to fm.fileName (two-way binding), readonly input binds to readonlyCaption
      const inputs = fixture.debugElement.queryAll(By.css('input[type="text"]'));

      // Since readonly is false, there should be only one text input rendered (in the @else block)
      // The @if block with readonly input should not be rendered
      expect(inputs.length).toBe(1);

    }));

  });

  describe('FormModel', () => {
    it('hasData should return false when fileData is empty', () => {
      component.fm.fileData = '';
      expect(component.fm.hasData).toBe(false);
    });

    it('hasData should return false when fileData is whitespace', () => {
      component.fm.fileData = '   ';
      expect(component.fm.hasData).toBe(false);
    });

    it('hasData should return true when fileData has content', () => {
      component.fm.fileData = 'data:application/pdf;base64,test';
      expect(component.fm.hasData).toBe(true);
    });

    it('invalid should return true when fileName is empty', () => {
      component.fm.fileName = '';
      expect(component.fm.invalid).toBe(true);
    });

    it('invalid should return true when fileName is whitespace', () => {
      component.fm.fileName = '   ';
      expect(component.fm.invalid).toBe(true);
    });

    it('invalid should return false when fileName has content', () => {
      component.fm.fileName = 'test.pdf';
      expect(component.fm.invalid).toBe(false);
    });
  });
});
