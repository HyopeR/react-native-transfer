import {Downloader} from './instances/Downloader';
import {Uploader} from './instances/Uploader';
import {DownloadNs, UploadNs} from '../types';

export class RNTransferModule {
  private Downloader: Downloader;
  private Uploader: Uploader;

  constructor() {
    this.Downloader = new Downloader();
    this.Uploader = new Uploader();
  }

  getDownloads() {}

  createDownload(options: DownloadNs.Options) {
    return this.Downloader.download(options) as DownloadNs.Transfer;
  }

  getUploads() {}

  upload(options: UploadNs.Options) {
    return this.Uploader.upload(options) as UploadNs.Transfer;
  }
}

// Examples
// const RNTransfer = new RNTransferModule();
//
// const transfer1 = RNTransfer.createDownload({
//   id: '1',
//   url: 'sample-1',
//   path: 'path-1',
// });
//
// const transfer2 = RNTransfer.createDownload({
//   id: '2',
//   url: 'sample-2',
//   path: 'path-2',
// });
//
// transfer1
//   .on('begin', e => {})
//   .on('progress', e => {})
//   .on('done', e => {
//     transfer1.remove();
//   })
//   .on('fail', e => {
//     transfer1.remove();
//   })
//   .start();
