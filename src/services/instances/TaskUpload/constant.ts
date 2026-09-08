import {TaskNativeNs} from '../../../types';

export const INITIAL_TYPE: TaskNativeNs.CoreUpload['type'] = 'upload';

export const INITIAL_STATUS: TaskNativeNs.Status = 'idle';

export const INITIAL_PROGRESS: TaskNativeNs.Progress = {
  bytesTotal: 0,
  bytesDownloaded: 0,
};
