import {EventSubscription} from 'react-native';
import RNTransferNative from '../../../specs/NativeRNTransfer';
import {DownloadTransfer} from './DownloadTransfer';
import {DownloadNs, DownloadInternalNs} from '../../../types';

export class Downloader {
  private readonly transfers: Map<string, DownloadInternalNs.Transfer>;
  private readonly transferHandlers: DownloadInternalNs.TransferHandlers;

  private readonly subscription: EventSubscription;

  constructor() {
    this.transfers = new Map<string, DownloadInternalNs.Transfer>();
    this.transferHandlers = {remove: this.remove};
    this.subscription = RNTransferNative.onDownload(this.syncEvent);
    this.sync();
  }

  private sync = async () => {
    try {
      const tasks = RNTransferNative.getDownloads();
      for (const task of tasks) {
        this.createTransfer(task);
      }
    } catch (e) {
      RNTransferNative.clearDownloads()
        .then()
        .catch()
        .finally(() => this.transfers.clear());
    }
  };

  private syncEvent = (event: DownloadNs.Event) => {
    const transfer = this.transfers.get(event.id);
    if (transfer) {
      transfer.apply(event);
    }
  };

  public get() {
    return [...this.transfers.values()];
  }

  public create(options: DownloadNs.Options) {
    const task = RNTransferNative.createDownload(options);
    return this.createTransfer(task);
  }

  private createTransfer = (task: DownloadNs.Task) => {
    const transfer = new DownloadTransfer(task, this.transferHandlers);
    this.transfers.set(transfer.id, transfer);
    return transfer;
  };

  private remove = async (id: string) => {
    await RNTransferNative.removeDownload(id);
    this.removeTransfer(id);
  };

  private removeTransfer = (id: string) => {
    return this.transfers.delete(id);
  };
}
