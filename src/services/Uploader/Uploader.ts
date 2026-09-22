import RNTransferNative from '../../specs/NativeRNTransfer';
import {Transfer} from './Transfer';
import {
  UploadTransferInternal,
  UploadTransferInternalHandlers,
  UploaderSubscription,
  UploadEvent,
  UploadOptions,
  UploadTask,
} from '../../types';

export class Uploader {
  private readonly transfers: Map<string, UploadTransferInternal>;
  private readonly transferHandlers: UploadTransferInternalHandlers;

  private readonly subscription: UploaderSubscription;

  constructor() {
    this.transfers = new Map();
    this.transferHandlers = {remove: this.remove};
    this.subscription = RNTransferNative.onUpload(this.listener);
  }

  public init = () => {
    try {
      const tasks = RNTransferNative.getUploads();
      for (const task of tasks) {
        this.createTransfer(task);
      }
    } catch (e) {
      RNTransferNative.clearUploads();
      this.transfers.clear();
    }
  };

  private listener = (event: UploadEvent) => {
    const transfer = this.transfers.get(event.id);
    if (transfer) {
      transfer.apply(event);
    }
  };

  public get() {
    return [...this.transfers.values()];
  }

  public getOne(id: string) {
    const task = RNTransferNative.getUpload(id);
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

  public create(options: UploadOptions) {
    const task = RNTransferNative.createUpload(options);
    return this.createTransfer(task);
  }

  private createTransfer = (task: UploadTask) => {
    const transfer = new Transfer(task, this.transferHandlers);
    this.transfers.set(transfer.id, transfer);
    return transfer;
  };

  private remove = (id: string) => {
    RNTransferNative.removeUpload(id);
    this.removeTransfer(id);
  };

  private removeTransfer = (id: string) => {
    return this.transfers.delete(id);
  };
}
