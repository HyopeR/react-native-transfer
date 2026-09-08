import {INITIAL_TYPE, INITIAL_STATUS, INITIAL_PROGRESS} from './constant';
import {TaskNativeNs} from '../../../types';

export class TaskDownload implements TaskNativeNs.CoreDownload {
  readonly options: TaskNativeNs.Options;

  type = INITIAL_TYPE;
  status = INITIAL_STATUS;
  progress = {...INITIAL_PROGRESS};

  constructor(
    options: TaskNativeNs.Options,
    status?: TaskNativeNs.Status,
    progress?: TaskNativeNs.Progress,
  ) {
    this.options = options;
    if (status) this.status = status;
    if (progress) this.progress = progress;
  }

  start() {}

  stop() {}
}
