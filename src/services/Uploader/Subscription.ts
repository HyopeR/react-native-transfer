import {
  UploadEvent,
  UploadSubscriptionInternal,
  UploadSubscriptionInternalListeners,
  UploadSubscriptionInternalHandlers,
} from '../../types';

export class Subscription implements UploadSubscriptionInternal {
  readonly id: string;
  private listeners: UploadSubscriptionInternalListeners;
  private handlers: UploadSubscriptionInternalHandlers;

  constructor(
    id: string,
    listeners: UploadSubscriptionInternalListeners,
    handlers: UploadSubscriptionInternalHandlers,
  ) {
    this.id = id;
    this.listeners = listeners;
    this.handlers = handlers;
  }

  emit(event: UploadEvent) {
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
