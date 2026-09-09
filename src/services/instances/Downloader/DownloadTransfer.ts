import RNTransferNative from '../../../specs/NativeRNTransfer';
import {DownloadNs} from '../../../types';

export class DownloadTransfer implements DownloadNs.Transfer {
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

  get status() {
    return this._status;
  }

  get progress() {
    return this._progress;
  }

  constructor(options: DownloadNs.Task) {
    this.id = options.id;
    this.url = options.url;
    this.path = options.path;
    this.headers = options.headers;
    this.metadata = options.metadata;
    this._status = options.status;
    this._progress = options.progress;
  }

  start() {
    RNTransferNative.startDownload(this.id);
  }

  stop() {
    RNTransferNative.stopDownload(this.id);
  }

  apply(event: DownloadNs.Event) {
    switch (event.type) {
      case 'begin':
        this._status = 'working';
        this._progress = {
          bytesDownload: 0,
          bytesTotal: event.bytesExpect,
        };
        break;

      case 'progress':
        this._status = 'working';
        this._progress = {
          bytesDownload: event.bytesDownload,
          bytesTotal: event.bytesTotal,
        };
        break;

      case 'done':
        this._status = 'done';
        this._progress = {
          bytesDownload: event.bytesDownload,
          bytesTotal: event.bytesTotal,
        };
        break;

      case 'fail':
        this._status = 'fail';
        break;
    }
  }
}
