import {DownloadEvent, DownloadEventListenerMap} from './DownloadEvent';

/** External */

export type DownloadSubscription = {
  id: Readonly<string>;
  unsubscribe(): void;
};

/** Internal */

export type DownloadSubscriptionInternal = {
  id: Readonly<string>;
  emit(event: DownloadEvent): void;
  unsubscribe(): void;
};

export type DownloadSubscriptionInternalListeners =
  Partial<DownloadEventListenerMap>;

export type DownloadSubscriptionInternalHandlers = {
  remove: (id: string) => void;
};
