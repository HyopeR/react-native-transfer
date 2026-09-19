import RNTransferNative from '../../specs/NativeRNTransfer';
import {Subscription} from './Subscription';
import {uuid} from '../../utils';
import {
  DownloadTransferInternal,
  DownloadTransferInternalHandlers,
  DownloadTransferInternalSubscriptions,
  DownloadStatus,
  DownloadProgress,
  DownloadTask,
  DownloadEvent,
  DownloadEventListenerMap,
} from '../../types';

export class Transfer implements DownloadTransferInternal {
  readonly id: string;
  readonly url: string;
  readonly path: string;
  readonly headers: Record<string, any> | undefined;
  readonly metadata: Record<string, any> | undefined;

  private _type: 'download' = 'download';
  private _status: DownloadStatus = 'idle';
  private _progress: DownloadProgress = {
    bytesDownload: 0,
    bytesTotal: 0,
  };

  private readonly handlers: DownloadTransferInternalHandlers;
  private readonly subscriptions: DownloadTransferInternalSubscriptions =
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

  constructor(task: DownloadTask, handlers: DownloadTransferInternalHandlers) {
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
    RNTransferNative.startDownload(this.id);
  }

  stop() {
    RNTransferNative.stopDownload(this.id);
  }

  async remove() {
    return this.handlers.remove(this.id);
  }

  subscribe = (listeners: Partial<DownloadEventListenerMap>) => {
    const id = uuid();
    const remove = (i: string) => this.unsubscribe(i);
    const subscription = new Subscription(id, listeners, {remove});
    this.subscriptions.set(subscription.id, subscription);
    return subscription;
  };

  unsubscribe = (id: string) => {
    return this.subscriptions.delete(id);
  };

  apply(event: DownloadEvent) {
    switch (event.type) {
      case 'begin':
        this._status = 'working';
        this._progress = {
          bytesDownload: 0,
          bytesTotal: event.bytesExpect,
        };
        this.emit(event);
        break;

      case 'progress':
        this._status = 'working';
        this._progress = {
          bytesDownload: event.bytesDownload,
          bytesTotal: event.bytesTotal,
        };
        this.emit(event);
        break;

      case 'done':
        this._status = 'done';
        this._progress = {
          bytesDownload: event.bytesDownload,
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

  private emit(event: DownloadEvent) {
    for (const subscription of this.subscriptions.values()) {
      subscription.emit(event);
    }
  }
}
