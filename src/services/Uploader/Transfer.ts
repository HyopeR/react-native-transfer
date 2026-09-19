import RNTransferNative from '../../specs/NativeRNTransfer';
import {Subscription} from './Subscription';
import {uuid} from '../../utils';
import {
  UploadTransferInternal,
  UploadTransferInternalHandlers,
  UploadTransferInternalSubscriptions,
  UploadStatus,
  UploadProgress,
  UploadTask,
  UploadEvent,
  UploadEventListenerMap,
} from '../../types';

export class Transfer implements UploadTransferInternal {
  readonly id: string;
  readonly url: string;
  readonly path: string;
  readonly headers: Record<string, any> | undefined;
  readonly metadata: Record<string, any> | undefined;

  private _type: 'upload' = 'upload';
  private _status: UploadStatus = 'idle';
  private _progress: UploadProgress = {
    bytesUpload: 0,
    bytesTotal: 0,
  };

  private readonly handlers: UploadTransferInternalHandlers;
  private readonly subscriptions: UploadTransferInternalSubscriptions =
    new Map();

  get type() {
    return this._type;
  }

  get status() {
    return this._status;
  }

  get progress() {
    return this._progress;
  }

  constructor(task: UploadTask, handlers: UploadTransferInternalHandlers) {
    this.handlers = handlers;
    this.id = task.id;
    this.url = task.url;
    this.path = task.path;
    this.headers = task.headers;
    this.metadata = task.metadata;
    this._status = task.status;
    this._progress = task.progress;
  }

  start() {
    RNTransferNative.startUpload(this.id);
  }

  stop() {
    RNTransferNative.stopUpload(this.id);
  }

  async remove() {
    return this.handlers.remove(this.id);
  }

  subscribe(listeners: Partial<UploadEventListenerMap>) {
    const id = uuid();
    const remove = (i: string) => this.unsubscribe(i);
    const subscription = new Subscription(id, listeners, {remove});
    this.subscriptions.set(subscription.id, subscription);
    return subscription;
  }

  unsubscribe(id: string) {
    this.subscriptions.delete(id);
  }

  apply(event: UploadEvent) {
    switch (event.type) {
      case 'begin':
        this._status = 'working';
        this._progress = {
          bytesUpload: 0,
          bytesTotal: event.bytesExpect,
        };
        this.emit(event);
        break;

      case 'progress':
        this._status = 'working';
        this._progress = {
          bytesUpload: event.bytesUpload,
          bytesTotal: event.bytesTotal,
        };
        this.emit(event);
        break;

      case 'done':
        this._status = 'done';
        this._progress = {
          bytesUpload: event.bytesUpload,
          bytesTotal: event.bytesTotal,
        };
        this.emit(event);
        break;

      case 'fail':
        this._status = 'fail';
        this.emit(event);
        break;
    }
  }

  private emit(event: UploadEvent) {
    for (const subscription of this.subscriptions.values()) {
      subscription.emit(event);
    }
  }
}
