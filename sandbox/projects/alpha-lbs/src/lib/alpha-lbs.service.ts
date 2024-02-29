import { Injectable } from '@angular/core';

class Subscriber {
  callback: (payload: any) => void;
  channel?: string;

  constructor(
    callback: (payload: any) => void,
    channel?: string) {
    this.callback = callback;
    this.channel = channel;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AlphaLbsService {

  private subscribers = new Map<number, Subscriber>();
  private lastSubscriberId = 0;

  /**
   * starts listening to the local bus for messages that matches a given channel
   * @param callback (payload: T) => void -> method to call on match
   * @param channel null -> catch all,
   *                hard ('topic') => catch if exact match (=== 'topic')
   *                soft ('topic*') => catch on starts with (startWith('topic'))
   * @returns subscriber number (to use for unsubscribing)
   */
  subscribe<T>(
    callback: (payload: T) => void,
    channel?: string): number {
    const subscriber = new Subscriber(callback, channel);
    this.subscribers.set(this.lastSubscriberId, subscriber);
    return this.lastSubscriberId++;
  }

  /** stops listening */
  unsubscribe(subscriberId: number): void {
    this.subscribers.delete(subscriberId);
  }

  /** broadcasts a given payload on a given channel */
  publish<T>(payload: T, channel: string): number {
    let nbHit = 0;
    this.subscribers
      .forEach((subscriber: Subscriber) => {
        let send = true;
        if (channel !== '*') {
          let subscriberChannel = subscriber.channel;
          if (subscriberChannel) {
            const wildCardPos = subscriberChannel.indexOf('*');
            switch (wildCardPos) {
              case -1:
                // no wild car found -> exact match
                send = subscriberChannel === channel;
                break;
              case 1:
                // starts with a wild card -> always send
                break;
              default:
                // wild card found -> check match
                subscriberChannel = subscriberChannel.substring(0, wildCardPos);
                send = channel.startsWith(subscriberChannel);
                break;
            }
          }
        }
        if (send) {
          nbHit++;
          subscriber.callback(payload);
        }
      });
    return nbHit;
  }
}
