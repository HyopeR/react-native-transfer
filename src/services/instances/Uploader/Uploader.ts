import {EventSubscription} from 'react-native';
import RNTransferNative from '../../../specs/NativeRNTransfer';
import {UploadTransfer} from './UploadTransfer';
import {UploadNs} from '../../../types';

export class Uploader {
  private readonly transfers: Map<string, UploadNs.TransferInternal>;
  private readonly transferHandlers: UploadNs.TransferHandlers;

  private readonly subscription: EventSubscription;

  constructor() {
    this.transfers = new Map<string, UploadNs.TransferInternal>();
    this.transferHandlers = {remove: this.remove};
    this.subscription = RNTransferNative.onUpload(this.syncEvent);
    this.sync();
  }

  private sync = async () => {
    try {
      const tasks = await RNTransferNative.getUploads();
      for (const task of tasks) {
        this.createTransfer(task);
      }
    } catch (e) {
      RNTransferNative.clearUploads();
      this.transfers.clear();
    }
  };

  private syncEvent = (event: UploadNs.Event) => {
    const transfer = this.transfers.get(event.id);
    if (transfer) {
      transfer.apply(event);
    }
  };

  public upload(options: UploadNs.Options) {
    const exist = RNTransferNative.getUpload(options.id);
    if (exist) {
      throw new Error('A transfer with this ID exists.');
    }

    const task = this.createTask(options);
    return this.createTransfer(task);
  }

  private createTask = (options: UploadNs.Options) => {
    return RNTransferNative.createUpload(options);
  };

  private createTransfer = (task: UploadNs.Task) => {
    const transfer = new UploadTransfer(task, this.transferHandlers);
    this.transfers.set(transfer.id, transfer);
    return transfer;
  };

  private removeTask = (id: string) => {
    return RNTransferNative.removeUpload(id);
  };

  private removeTransfer = (id: string) => {
    return this.transfers.delete(id);
  };

  private remove = (id: string) => {
    this.removeTask(id);
    this.removeTransfer(id);
  };
}
