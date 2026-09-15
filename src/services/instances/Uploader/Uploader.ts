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
    this.subscription = RNTransferNative.onUpload(this.syncEvent);
    this.sync();
  }

  private sync = async () => {
    try {
      const tasks = RNTransferNative.getUploads();
      for (const task of tasks) {
        this.createTransfer(task);
      }
    } catch (e) {
      RNTransferNative.clearUploads()
        .then()
        .catch()
        .finally(() => this.transfers.clear());
    }
  };

  private syncEvent = (event: UploadNs.Event) => {
    const transfer = this.transfers.get(event.id);
    if (transfer) {
      transfer.apply(event);
    }
  };

  public get() {
    return [...this.transfers.values()];
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
