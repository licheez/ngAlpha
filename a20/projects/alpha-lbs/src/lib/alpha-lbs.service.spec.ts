import { TestBed } from '@angular/core/testing';

import { AlphaLbsService } from './alpha-lbs.service';

describe('AlphaLbsService', () => {
  let service: AlphaLbsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlphaLbsService]
    });
    service = TestBed.inject(AlphaLbsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should subscribe', () => {
    const subId1 = service.subscribe(
      payload => console.log(payload));
    expect(subId1).toEqual(0);
    const subId2 = service.subscribe(
      payload => console.log(payload));
    expect(subId2).toEqual(1);
  });

  it('should unsubscribe', () => {
    const subId1 = service.subscribe(
      payload => console.log(payload));
    expect(subId1).toEqual(0);
    service.unsubscribe(subId1);
    expect(function() {
      service.unsubscribe(subId1);}).not.toThrow();
  });

  it('should publish', () => {
    service.subscribe(
      payload =>
        expect(payload).toEqual('t1'),
      'channel1');
    service.subscribe(
      payload =>
        expect(payload).toEqual('t2'),
      'channel2');
    service.subscribe(()=>{});
    service.subscribe(()=>{}, '*');
    let nbHits = service.publish('t1', 'channel1');
    expect(nbHits).toEqual(3);
    nbHits = service.publish('t2', 'channel2');
    expect(nbHits).toEqual(3);
  });

  it('should broadcast when publishing to all', () => {
    service.subscribe(
      payload =>
        expect(payload).toEqual('test'),
      'channel1');
    service.subscribe(
      payload =>
        expect(payload).toEqual('test'),
      'chan*');
    service.subscribe(
      payload =>
        expect(payload).toEqual('test'),
      '*');
    const nbHits = service.publish('test', '*');
    expect(nbHits).toEqual(3);
  });

  it('should work when publishing to a specific channel', () => {
    service.subscribe(
      payload =>
        expect(payload).toEqual('test'),
      'channel1');
    service.subscribe(
      payload =>
        expect(payload).toEqual('test'),
      'chan*');
    service.subscribe(
      payload =>
        expect(payload).toEqual('test'),
      '*');
    const nbHits = service.publish('test', 'chan');
    expect(nbHits).toEqual(2);
  });


});
