import {
  DownloadEvent,
  DownloadSubscriptionInternal,
  DownloadSubscriptionInternalListeners,
  DownloadSubscriptionInternalHandlers,
} from '../../types';

export class Subscription implements DownloadSubscriptionInternal {
  readonly id: string;
  private listeners: DownloadSubscriptionInternalListeners;
  private handlers: DownloadSubscriptionInternalHandlers;

  constructor(
    id: string,
    listeners: DownloadSubscriptionInternalListeners,
    handlers: DownloadSubscriptionInternalHandlers,
  ) {
    this.id = id;
    this.listeners = listeners;
    this.handlers = handlers;
  }

  emit(event: DownloadEvent) {
    switch (event.type) {
      case 'begin':
        if (this.listeners?.begin) this.listeners.begin(event);
        break;
      case 'progress':
        if (this.listeners?.progress) this.listeners.progress(event);
        break;
      case 'done':
        if (this.listeners?.done) this.listeners.done(event);
        break;
      case 'fail':
        if (this.listeners?.fail) this.listeners.fail(event);
        break;
    }
  }

  unsubscribe() {
    return this.handlers.remove(this.id);
  }
}
