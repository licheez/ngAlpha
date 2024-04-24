// noinspection JSUnusedGlobalSymbols

/**
 * Represents a local bus service that allows
 * subscribing to and publishing messages
 * on a given channel.
 * @interface
 */
export interface IAlphaLocalBusService {
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
    channel?: string): number;

  /** stops listening */
  unsubscribe(subscriberId: number): void;

  /**
   * Broadcasts a given payload on a given channel.
   *
   * @param payload - The payload to be published.
   * @param {string} channel - The channel on which the payload will be sent.
   * @return {number} - The number of subscribers who received the payload.
   */
  publish<T>(payload: T, channel: string): number
}
