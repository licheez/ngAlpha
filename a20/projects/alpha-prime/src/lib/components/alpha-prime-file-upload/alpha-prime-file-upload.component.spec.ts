import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaPrimeFileUploadComponent } from './alpha-prime-file-upload.component';

describe('AlphaPrimeFileUpload', () => {
  let component: AlphaPrimeFileUploadComponent;
  let fixture: ComponentFixture<AlphaPrimeFileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphaPrimeFileUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
