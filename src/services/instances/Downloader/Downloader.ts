import {EventSubscription} from 'react-native';
import RNTransferNative from '../../../specs/NativeRNTransfer';
import {DownloadTransfer} from './DownloadTransfer';
import {DownloadNs} from '../../../types';

class DownloaderService {
  private readonly transfers = new Map<string, DownloadNs.Transfer>();

  private readonly subscription: EventSubscription;

  constructor() {
    this.subscription = RNTransferNative.onDownload(this.syncEvent);
    this.sync();
  }

  public download(options: DownloadNs.Options) {
    const exist = RNTransferNative.getDownload(options.id);
    if (exist) {
      throw new Error('A transfer with this ID exists.');
    }

    const task = RNTransferNative.createDownload(options);
    const transfer = new DownloadTransfer(task);
    this.transfers.set(transfer.id, transfer);
    return transfer;
  }

  public start(id: string) {
    const transfer = this.getTransfer(id);
    transfer.start();
  }

  public stop(id: string) {
    const transfer = this.getTransfer(id);
    transfer.stop();
  }

  private getTransfer(id: string): DownloadNs.Transfer {
    const transfer = this.transfers.get(id);

    if (!transfer) {
      throw new Error(`A transfer with ID "${id}" was not found.`);
    }

    return transfer;
  }

  private sync = async () => {
    try {
      const tasks = await RNTransferNative.getDownloads();
      for (const task of tasks) {
        this.transfers.set(task.id, new DownloadTransfer(task));
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
}
