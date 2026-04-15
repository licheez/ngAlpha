import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { of } from 'rxjs';

import { AlphaPrimeService } from './alpha-prime.service';

describe('AlphaPrimeService', () => {
  let service: AlphaPrimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlphaPrimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('generateRandomName returns default length of 50', () => {
    const name = service.generateRandomName();
    expect(name).toBeTruthy();
    expect(name.length).toBe(50);
  });

  it('generateRandomName respects custom length', () => {
    const name = service.generateRandomName(10);
    expect(name).toBeTruthy();
    expect(name.length).toBe(10);
  });

  it('getTr default returns formatted string', () => {
    const result = service.getTr('key', 'en');
    expect(result).toContain("'key'");
    expect(result).toContain("'en'");
  });

  it('signIn default observable emits false', async () => {
    const res = await firstValueFrom(service.signIn('u', 'p', false));
    expect(res).toBe(false);
  });

  it('upload default observable emits empty string', async () => {
    const res = await firstValueFrom(service.upload({}, () => {}));
    expect(res).toBe('');
  });

  it('publish/subscribe/unsubscribe have default values', () => {
    expect(service.publish({}, 'channel')).toBe(0);
    expect(service.subscribe(() => {}, 'channel')).toBe(-1);
    expect(service.unsubscribe(1)).toBeUndefined();
  });

  it('init wires provided services correctly', async () => {
    const mockTranslation = { getTr: (k: string, l?: string) => `tr:${k}:${l}` };
    const mockLogger = { postNavigationLog: () => {} };
    const mockOAuth = { signIn: (_u: string, _p: string, _r: boolean) => of(true) };
    const mockUpload = {
      upload: (_data: any, _notify: (p: number) => any) => of('upload-id'),
      deleteUpload: (_id: string) => of({})
    };
    const mockBus = {
      publish: (_payload: any, _channel: string) => 123,
      subscribe: (_cb: (p: any) => any, _channel?: string) => 456,
      unsubscribe: (_id: number) => null
    };

    service.init(false, mockTranslation, mockLogger, mockOAuth, mockUpload, mockBus);

    expect(service.getTr('a', 'b')).toBe('tr:a:b');
    expect(service.postNavigationLog).toBe(mockLogger.postNavigationLog);

    const signInResult = await firstValueFrom(service.signIn('u', 'p', true));
    expect(signInResult).toBe(true);

    const uploadResult = await firstValueFrom(service.upload({}, () => {}));
    expect(uploadResult).toBe('upload-id');

    expect(service.publish({}, 'x')).toBe(123);
    expect(service.subscribe(() => {}, 'x')).toBe(456);
    expect(service.unsubscribe(1)).toBeNull();
  });
});

