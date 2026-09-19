import RNTransferNative from '../../specs/NativeRNTransfer';
import {Transfer} from './Transfer';
import {
  DownloadTransferInternal,
  DownloadTransferInternalHandlers,
  DownloaderSubscription,
  DownloadEvent,
  DownloadOptions,
  DownloadTask,
} from '../../types';

export class Downloader {
  private readonly transfers: Map<string, DownloadTransferInternal>;
  private readonly transferHandlers: DownloadTransferInternalHandlers;

  private readonly subscription: DownloaderSubscription;

  constructor() {
    this.transfers = new Map();
    this.transferHandlers = {remove: this.remove};
    this.subscription = RNTransferNative.onDownload(this.listener);
  }

  public init = async () => {
    try {
      const tasks = RNTransferNative.getDownloads();
      for (const task of tasks) {
        this.createTransfer(task);
      }
    } catch (e) {
      await RNTransferNative.clearDownloads();
      this.transfers.clear();
    }
  };

  private listener = (event: DownloadEvent) => {
    const transfer = this.transfers.get(event.id);
    if (transfer) {
      transfer.apply(event);
    }
  };

  public get() {
    return [...this.transfers.values()];
  }

  public getOne(id: string) {
    const task = RNTransferNative.getDownload(id);
    const transfer = this.transfers.get(id);

    if (task && transfer) {
      return transfer;
    }

    if (task && !transfer) {
      return this.createTransfer(task);
    }

    if (!task && transfer) {
      this.transfers.delete(id);
      return undefined;
    }

    return undefined;
  }

  public create(options: DownloadOptions) {
    const task = RNTransferNative.createDownload(options);
    return this.createTransfer(task);
  }

  private createTransfer = (task: DownloadTask) => {
    const transfer = new Transfer(task, this.transferHandlers);
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
