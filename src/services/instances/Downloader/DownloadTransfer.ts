import RNTransferNative from '../../../specs/NativeRNTransfer';
import {DownloadNs} from '../../../types';

export class DownloadTransfer implements DownloadNs.TransferInternal {
  readonly id: string;
  readonly url: string;
  readonly path: string;
  readonly headers: Record<string, any> | undefined;
  readonly metadata: Record<string, any> | undefined;

  readonly type: 'download' = 'download';
  private _status: DownloadNs.Status = 'idle';
  private _progress: DownloadNs.Progress = {
    bytesDownload: 0,
    bytesTotal: 0,
  };

  private readonly handlers: DownloadNs.TransferHandlers;
  private readonly listeners: DownloadNs.EventListenerMap = {
    begin: new Set(),
    progress: new Set(),
    done: new Set(),
    fail: new Set(),
  };

  get status() {
    return this._status;
  }

  get progress() {
    return this._progress;
  }

  constructor(task: DownloadNs.Task, handlers: DownloadNs.TransferHandlers) {
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

  remove() {
    this.handlers.remove(this.id);
  }

  apply(event: DownloadNs.Event) {
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

  on<T extends DownloadNs.EventType>(
    type: T,
    listener: DownloadNs.EventListener<T>,
  ): this {
    this.listeners[type].add(listener);
    return this;
  }

  private emit(event: DownloadNs.Event) {
    for (const listener of this.listeners[event.type]) {
      listener(event as any);
    }
  }
}
