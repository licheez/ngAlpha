import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AlphaPrimeFileUploadComponent} from './alpha-prime-file-upload.component';
import {jest} from "@jest/globals";
import {AlphaPrimeService} from "../../services/alpha-prime.service";
import {Observable, of, Subscriber, throwError} from "rxjs";
import {ElementRef} from "@angular/core";
import {IAlphaPrimeFileUpload} from "./alpha-prime-file-upload";

describe('AlphaPrimeFileUploadComponent', () => {
  let alphaPrimeService: AlphaPrimeService;
  let component: AlphaPrimeFileUploadComponent;
  let fixture: ComponentFixture<AlphaPrimeFileUploadComponent>;
  let fileReaderMock: {
    readAsDataURL: (file: File) => any,
    onload: ((loadEvent: any) => any) | null,
    onerror: ((error: any) => any) | null
  }
  const targetResult =
    'data:image/png;base64,someBase64PngData';
  const originalFileReader = window.FileReader;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [AlphaPrimeFileUploadComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    jest.useFakeTimers();

    fileReaderMock = {
      readAsDataURL: file => {
        console.log('readAsDataUrl', file.name);
      },
      onload: null,
      onerror: null,
    };

    window.FileReader = jest.fn()
      .mockImplementation(() => fileReaderMock) as any;
  });

  afterEach(() => {
    jest.useRealTimers();
    window.FileReader = originalFileReader;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.name).not.toEqual('');
    expect(component.accept).toBeUndefined();
    expect(component.disabled).toBeFalsy();
    expect(component.autoUpload).toBeTruthy();
    expect(component.deleteOnClear).toBeFalsy();
    expect(component.readonly).toBeFalsy();
    expect(component.readonlyCaption).toEqual('');
    expect(component.sm).toBeFalsy();
    expect(component.busy).toBeFalsy();
    expect(component.fm).toBeTruthy();
    expect(component.fm.invalid).toBeTruthy();
  });

  describe('reset form functions', () => {

    it('ngAfterViewInit should emit reset form function', () => {
      const readyEmitterSpy = jest.spyOn(component.ready, 'emit');
      component.ngAfterViewInit();
      expect(readyEmitterSpy).toHaveBeenCalledWith(component.resetForm);
    });

    it('resetForm should work', () => {
      const resetFormSpy =
        jest.spyOn(component, 'resetForm');
      const initialFm = component.fm;
      component.fu = {
        uploadId: 'uploadId',
        fileName: "someFileName",
        fileData: 'someData'
      };
      component.uploading = true;
      component.progress = 50;
      component.resetForm();
      expect(component.fm).not.toBe(initialFm);
      expect(component.fu).toBeUndefined();
      expect(component.uploading).toBeFalsy();
      expect(component.progress).toEqual(0);
      expect(resetFormSpy).toHaveBeenCalled();
    });

  });

  describe('onFileInputChange', () => {
    it('should handle read.onload event with success', () => {

      const changeEvent = {
        target: {
          files: [new File(['(⌐□_□)'], 'chill.png', {type: 'image/png'})]
        },
      };

      component.onFileInputChanged(changeEvent as any);

      fileReaderMock.onload!({
        target: {
          result: targetResult
        }
      } as any);
      expect(component.fm.fileData).toEqual(targetResult);
      expect(component.busy).toBeFalsy();
    });
    it('should handle read.onload event with error', () => {
      const changeEvent = {
        target: {
          files: [new File(['(⌐□_□)'], 'chill.png', {type: 'image/png'})]
        },
      };

      component.onFileInputChanged(changeEvent as any);

      fileReaderMock.onload!({
        target: {
          result: targetResult
        }
      } as any);
      expect(component.fm.fileData).toEqual(targetResult);
      expect(component.busy).toBeFalsy();

      fileReaderMock.onerror!('someError');
    });
    it('should handle read.onload throwing an error', () => {

      fileReaderMock.readAsDataURL = () => {
        throw new Error('raising an error')
      };

      const changeEvent = {
        target: {
          files: [new File(['(⌐□_□)'], 'chill.png', {type: 'image/png'})]
        },
      };

      component.onFileInputChanged(changeEvent as any);
    });
    it('should handle read.onload when file is not set', () => {
      const changeEvent = {
        target: {
          files: [undefined]
        },
      };

      component.onFileInputChanged(changeEvent as any);
    });

  });

  describe('delete an upload', () => {

    it('should delete an upload with success', () => {

      const delUpload =
        jest.fn(() => of({}));

      alphaPrimeService = {
        deleteUpload: delUpload,
        getTr: jest.fn(() => 'someTranslation'),
        generateRandomName: jest.fn(() => 'someName')
      } as unknown as AlphaPrimeService;

      component = new AlphaPrimeFileUploadComponent(alphaPrimeService);
      component.fileDeleted = {emit: jest.fn()} as any;

      const uploadId = 'uploadId';
      component.fu = {
        uploadId,
        fileName: "someFileName",
        fileData: 'someData'
      };
      component.deleteOnClear = true;
      component.onClear();
      expect(alphaPrimeService.deleteUpload).toHaveBeenCalledWith(uploadId);
      expect(component.fileDeleted.emit).toHaveBeenCalledWith(uploadId);
    });

    it('should delete an upload returning an error', () => {

      const du = jest.fn(
        () => throwError(() => 'someError')
      );

      alphaPrimeService = {
        deleteUpload: du,
        getTr: jest.fn(() => 'someTranslation'),
        generateRandomName: jest.fn(() => 'someName')
      } as unknown as AlphaPrimeService;

      component = new AlphaPrimeFileUploadComponent(alphaPrimeService);
      component.fileDeleted = {emit: jest.fn()} as any;

      const uploadId = 'uploadId';
      component.fu = {
        uploadId,
        fileName: "someFileName",
        fileData: 'someData'
      };
      component.deleteOnClear = true;
      component.onClear();
      expect(alphaPrimeService.deleteUpload).toHaveBeenCalledWith(uploadId);
      expect(component.fu).toBeUndefined();
    });

  });

  describe('handle onSave', () => {

    it ('should handle onSave and upload with success', () => {
      const uploadFile =
        jest.fn((
          data: any,
          notifyProgress: (progress: number) => any
        ): Observable<string> => {
          notifyProgress(10);
          return new Observable<string>(
            (subscriber: Subscriber<string>) => {
            setTimeout(() => {
              notifyProgress(100);
              subscriber.next('uploadId')
            }, 10);
          });
        });

      alphaPrimeService = {
        upload: uploadFile,
        getTr: jest.fn(() => 'someTranslation'),
        generateRandomName: jest.fn(() => 'someName')
      } as unknown as AlphaPrimeService;

      component = new AlphaPrimeFileUploadComponent(alphaPrimeService);
      component.fileUploaded = {emit: jest.fn()} as any;

      component.onSave();
      expect(component.busy).toBeTruthy();
      expect(component.uploading).toBeTruthy();
      expect(component.progress).toEqual(10);

      jest.advanceTimersByTime(10);

      expect(component.progress).toEqual(100);
      expect(component.busy).toBeFalsy();
      expect(component.fu?.uploadId).toEqual('uploadId');

      const fu: IAlphaPrimeFileUpload = {
        uploadId: 'uploadId',
        fileName: '',
        fileData: ''
      }

      expect(component.fileUploaded.emit).toHaveBeenCalledWith(fu);

      jest.advanceTimersByTime(2000);
      expect(component.uploading).toBeFalsy();
    });

    it ('should handle onSave and upload returning an error', () => {
      const uploadFile =
        jest.fn((
          data: any,
          notifyProgress: (progress: number) => any
        ): Observable<string> => {
          notifyProgress(10);
          return new Observable<string>(
            (subscriber: Subscriber<string>) => {
            setTimeout(() => {
              notifyProgress(100);
              subscriber.error('someError')
            }, 10);
          });
        });

      alphaPrimeService = {
        upload: uploadFile,
        getTr: jest.fn(() => 'someTranslation'),
        generateRandomName: jest.fn(() => 'someName')
      } as unknown as AlphaPrimeService;

      component = new AlphaPrimeFileUploadComponent(alphaPrimeService);
      component.fileUploaded = {emit: jest.fn()} as any;

      component.onSave();
      expect(component.busy).toBeTruthy();
      expect(component.uploading).toBeTruthy();
      expect(component.progress).toEqual(10);

      jest.advanceTimersByTime(10);

      expect(component.progress).toEqual(100);
      expect(component.busy).toBeFalsy();
      expect(component.fu).toBeUndefined();
      expect(component.fileUploaded.emit).not.toHaveBeenCalled();
    });
  });

  describe('handle onBrowse', () => {

    it('should call click() of the file input field in onBrowse method', () => {
      // Arrange
      component.fileInput = {
        nativeElement: {
          click: jest.fn()
        }
      } as unknown as ElementRef<HTMLInputElement>;

      // Act
      component.onBrowse();

      // Assert
      expect(component.fileInput.nativeElement.click).toHaveBeenCalled();
    });

    it('should throw an error when fileInput is not available', () => {
      component.fileInput = null!;

      expect(() => component.onBrowse())
        .toThrow('fileInput should not be null');
    });

  });

});
