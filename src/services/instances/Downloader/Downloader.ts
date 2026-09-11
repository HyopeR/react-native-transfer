import {EventSubscription} from 'react-native';
import RNTransferNative from '../../../specs/NativeRNTransfer';
import {DownloadTransfer} from './DownloadTransfer';
import {DownloadNs} from '../../../types';

export class Downloader {
  private readonly transfers: Map<string, DownloadNs.TransferInternal>;
  private readonly transferHandlers: DownloadNs.TransferHandlers;

  private readonly subscription: EventSubscription;

  constructor() {
    this.transfers = new Map<string, DownloadNs.TransferInternal>();
    this.transferHandlers = {remove: this.remove};
    this.subscription = RNTransferNative.onDownload(this.syncEvent);
    this.sync();
  }

  private sync = async () => {
    try {
      const tasks = await RNTransferNative.getDownloads();
      for (const task of tasks) {
        const transfer = new DownloadTransfer(task, this.transferHandlers);
        this.transfers.set(task.id, transfer);
      }
    } catch (e) {
      RNTransferNative.clearDownloads();
      this.transfers.clear();
    }
  };

  private syncEvent = (event: DownloadNs.Event) => {
    const transfer = this.transfers.get(event.id);
    if (transfer) {
      transfer.apply(event);
    }
  };

  public download(options: DownloadNs.Options) {
    const exist = RNTransferNative.getDownload(options.id);
    if (exist) {
      throw new Error('A transfer with this ID exists.');
    }

    const task = RNTransferNative.createDownload(options);
    const transfer = new DownloadTransfer(task, this.transferHandlers);
    this.transfers.set(transfer.id, transfer);
    return transfer;
  }

  private remove = (id: string) => {
    this.transfers.delete(id);
  };
}
