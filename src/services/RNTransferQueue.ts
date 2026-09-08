import type {TaskInstance} from '../types';

export class RNTransferQueue {
  private tasks: TaskInstance[] = [];

  add(instance: TaskInstance) {}

  remove(instance: TaskInstance) {}
}
