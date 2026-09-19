import {UploadEvent, UploadEventListenerMap} from './UploadEvent';

/** External */

export type UploadSubscription = {
  id: Readonly<string>;
  unsubscribe(): void;
};

/** Internal */

export type UploadSubscriptionInternal = {
  id: Readonly<string>;
  emit(event: UploadEvent): void;
  unsubscribe(): void;
};

export type UploadSubscriptionInternalListeners =
  Partial<UploadEventListenerMap>;

export type UploadSubscriptionInternalHandlers = {
  remove: (id: string) => void;
};
