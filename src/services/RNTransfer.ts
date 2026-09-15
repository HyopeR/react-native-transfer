import {Helper} from './instances/Helper';
import {Downloader} from './instances/Downloader';
import {Uploader} from './instances/Uploader';
import {DownloadNs, UploadNs} from '../types';

export class RNTransferModule {
  private readonly helper: Helper;
  private readonly downloader: Downloader;
  private readonly uploader: Uploader;

  constructor() {
    this.helper = new Helper();
    this.downloader = new Downloader();
    this.uploader = new Uploader();
  }

  get directories() {
    return this.helper.directories;
  }

  uuid() {
    return this.helper.uuid();
  }

  getDownloads(): DownloadNs.Transfer[] {
    return this.downloader.get();
  }

  createDownload(options: DownloadNs.Options): DownloadNs.Transfer {
    return this.downloader.create(options);
  }

  getUploads(): UploadNs.Transfer[] {
    return this.uploader.get();
  }

  createUpload(options: UploadNs.Options): UploadNs.Transfer {
    return this.uploader.create(options);
  }
}

export const RNTransfer = new RNTransferModule();

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
// transfer1
//   .on('begin', e => {
//     console.log(e.bytesExpect);
//   })
//   .on('progress', e => {
//     console.log(e.bytesDownload);
//     console.log(e.bytesTotal);
//   })
//   .on('done', e => {
//     console.log(e.bytesDownload);
//     console.log(e.bytesTotal);
//     transfer1.remove();
//   })
//   .on('fail', e => {
//     console.log(e.error);
//     console.log(e.errorCode);
//     transfer1.remove();
//   })
//   .start();
