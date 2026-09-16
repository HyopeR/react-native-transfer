import {EventSubscription} from 'react-native';
import RNTransferNative from '../../../specs/NativeRNTransfer';
import {UploadTransfer} from './UploadTransfer';
import {UploadNs, UploadInternalNs} from '../../../types';

export class Uploader {
  private readonly transfers: Map<string, UploadInternalNs.Transfer>;
  private readonly transferHandlers: UploadInternalNs.TransferHandlers;

  private readonly subscription: EventSubscription;

  constructor() {
    this.transfers = new Map<string, UploadInternalNs.Transfer>();
    this.transferHandlers = {remove: this.remove};
    this.subscription = RNTransferNative.onUpload(this.listener);
  }

  public init = async () => {
    try {
      const tasks = RNTransferNative.getUploads();
      for (const task of tasks) {
        this.createTransfer(task);
      }
    } catch (e) {
      await RNTransferNative.clearUploads();
      this.transfers.clear();
    }
  };

  private listener = (event: UploadNs.Event) => {
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

  public create(options: UploadNs.Options) {
    const task = RNTransferNative.createUpload(options);
    return this.createTransfer(task);
  }

  private createTransfer = (task: UploadNs.Task) => {
    const transfer = new UploadTransfer(task, this.transferHandlers);
    this.transfers.set(transfer.id, transfer);
    return transfer;
  };

  private remove = async (id: string) => {
    await RNTransferNative.removeUpload(id);
    this.removeTransfer(id);
  };

  private removeTransfer = (id: string) => {
    return this.transfers.delete(id);
  };
}
