import type {TaskNativeNs} from './TaskNative';

export type Task = TaskNativeNs.CoreDownload | TaskNativeNs.CoreUpload;

export type TaskInstance = Task & {
  start(): Promise<Task>;
  stop(): Promise<Task>;
};
