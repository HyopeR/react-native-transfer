import type {TaskInstance} from '../types';

export class RNTransferQueue {
  private _tasks: TaskInstance[] = [];

  add(instance: TaskInstance) {}

  remove(instance: TaskInstance) {}
}
