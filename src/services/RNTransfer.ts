import {Helper} from './Helper';
import {Downloader} from './Downloader';
import {Uploader} from './Uploader';
import {
  DownloadOptions,
  DownloadTransfer,
  UploadOptions,
  UploadTransfer,
} from '../types';

export class RNTransferModule {
  private _ready = false;

  private readonly helper: Helper;
  private readonly downloader: Downloader;
  private readonly uploader: Uploader;

  constructor() {
    this.helper = new Helper();
    this.downloader = new Downloader();
    this.uploader = new Uploader();
    this.init();
  }

  private async init() {
    try {
      this.downloader.init();
      this.uploader.init();
      this._ready = true;
    } catch (e) {
      this._ready = true;
    }
  }

  get ready() {
    return this._ready;
  }

  get directories() {
    return this.helper.directories;
  }

  uuid() {
    return this.helper.uuid();
  }

  getDownloads(): DownloadTransfer[] {
    return this.downloader.get();
  }

  getDownload(id: string): DownloadTransfer | undefined {
    return this.downloader.getOne(id);
  }

  createDownload(options: DownloadOptions): DownloadTransfer {
    return this.downloader.create(options);
  }

  getUploads(): UploadTransfer[] {
    return this.uploader.get();
  }

  getUpload(id: string): UploadTransfer | undefined {
    return this.uploader.getOne(id);
  }

  createUpload(options: UploadOptions): UploadTransfer {
    return this.uploader.create(options);
  }
}

export const RNTransfer = new RNTransferModule();

// const transfer1 = RNTransfer.createDownload({
//   id: RNTransfer.uuid(),
//   url: '.com/sample-1.png',
//   path: RNTransfer.directories.app.concat(`/files/sample-1.png`),
// });
//
// const transfer2 = RNTransfer.createDownload({
//   id: RNTransfer.uuid(),
//   url: '.com/sample-2.png',
//   path: RNTransfer.directories.app.concat(`/files/sample-2.png`),
// });
//
// const subscription = transfer1.subscribe({
//   begin: () => {},
//   progress: () => {},
//   done: () => {},
//   fail: () => {},
// });
//
// subscription.id;
// subscription.unsubscribe();
//
// transfer1.start();
// transfer1.stop();
// transfer1.remove();

// const group = RNTransfer.createDownloadGroup({
//   id: RNTransfer.uuid(),
//   name: 'Something',
// });
//
// group.addDownload({
//   id: RNTransfer.uuid(),
//   url: '.com/sample-1.png',
//   path: RNTransfer.directories.app.concat(`/files/sample-1.png`),
// });
//
// group.addDownload({
//   id: RNTransfer.uuid(),
//   url: '.com/sample-2.png',
//   path: RNTransfer.directories.app.concat(`/files/sample-2.png`),
// });
//
// const transfers = RNTransfer.getDownloads();
// const groupTransfers = group.getDownloads();
//
// group.start();
// group.stop();
// group.remove();
