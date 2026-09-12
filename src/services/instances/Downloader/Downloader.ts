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
        this.createTransfer(task);
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

    const task = this.createTask(options);
    return this.createTransfer(task);
  }

  private createTask = (options: DownloadNs.Options) => {
    return RNTransferNative.createDownload(options);
  };

  private createTransfer = (task: DownloadNs.Task) => {
    const transfer = new DownloadTransfer(task, this.transferHandlers);
    this.transfers.set(transfer.id, transfer);
    return transfer;
  };

  private removeTask = (id: string) => {
    return RNTransferNative.removeDownload(id);
  };

  private removeTransfer = (id: string) => {
    return this.transfers.delete(id);
  };

  private remove = (id: string) => {
    this.removeTask(id);
    this.removeTransfer(id);
  };
}
