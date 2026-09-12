import RNTransferNative from '../../../specs/NativeRNTransfer';
import {UploadNs, UploadInternalNs} from '../../../types';

export class UploadTransfer implements UploadInternalNs.Transfer {
  readonly id: string;
  readonly url: string;
  readonly path: string;
  readonly headers: Record<string, any> | undefined;
  readonly metadata: Record<string, any> | undefined;

  readonly type: 'upload' = 'upload';
  private _status: UploadNs.Status = 'idle';
  private _progress: UploadNs.Progress = {
    bytesUpload: 0,
    bytesTotal: 0,
  };

  private readonly handlers: UploadInternalNs.TransferHandlers;
  private readonly listeners: UploadInternalNs.TransferListeners = {
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

  constructor(
    task: UploadNs.Task,
    handlers: UploadInternalNs.TransferHandlers,
  ) {
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

  remove() {
    this.handlers.remove(this.id);
  }

  apply(event: UploadNs.Event) {
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

  on<T extends UploadNs.EventType>(
    type: T,
    listener: UploadNs.EventListener<T>,
  ): this {
    this.listeners[type].add(listener);
    return this;
  }

  private emit(event: UploadNs.Event) {
    for (const listener of this.listeners[event.type]) {
      listener(event as any);
    }
  }
}
