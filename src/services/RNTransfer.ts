import {RNTransferQueue} from './RNTransferQueue';
import {TaskDownload} from './instances/TaskDownload';
import {TaskUpload} from './instances/TaskUpload';
import type {TaskNativeNs} from '../types';

export class RNTransfer {
  private queue: RNTransferQueue;

  constructor() {
    this.queue = new RNTransferQueue();
  }

  get() {}

  download(options: TaskNativeNs.Options) {
    try {
      const instance = new TaskDownload(options);
      this.queue.add(instance);
    } catch (e) {
      console.log(e);
    }
  }

  upload(options: TaskNativeNs.Options) {
    try {
      const instance = new TaskUpload(options);
      this.queue.add(instance);
    } catch (e) {
      console.log(e);
    }
  }
}
