import {Injectable} from "@angular/core";

/**
 * Represents a subscriber to the local bus service.
 * Stores the callback to invoke and the channel to listen on.
 */
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

/**
 * AlphaLbsService - Lightweight Local Bus Service
 *
 * Provides a simple publish/subscribe mechanism for in-memory message passing within an Angular application.
 * Subscribers can listen to specific channels or use wildcards for flexible message routing.
 *
 * Usage:
 *   - Subscribe to a channel with a callback.
 *   - Publish messages to a channel.
 *   - Unsubscribe using the subscriber ID.
 */
@Injectable({
  providedIn: 'root'
})
export class AlphaLbsService {

  private subscribers = new Map<number, Subscriber>();
  private lastSubscriberId = 0;

  /**
   * Subscribes to the local bus for messages matching a given channel.
   *
   * @param callback - Function to call when a matching message is received.
   * @param channel - Channel to listen on. Null for all, exact match ('topic'), or prefix match ('topic*').
   * @returns Subscriber ID (used for unsubscribing).
   */
  subscribe<T>(
    callback: (payload: T) => void,
    channel?: string): number {
    const subscriber = new Subscriber(callback, channel);
    this.subscribers.set(this.lastSubscriberId, subscriber);
    return this.lastSubscriberId++;
  }

  /**
   * Unsubscribes from the local bus.
   *
   * @param subscriberId - The ID returned by subscribe().
   */
  unsubscribe(subscriberId: number): void {
    this.subscribers.delete(subscriberId);
  }

  /**
   * Broadcasts a payload on a given channel to all matching subscribers.
   *
   * @param payload - The payload to publish.
   * @param channel - The channel to broadcast on.
   * @returns Number of subscribers who received the payload.
   */
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
              case 0:
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
