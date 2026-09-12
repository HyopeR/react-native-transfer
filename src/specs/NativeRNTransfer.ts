import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';
import {
  UnsafeObject,
  EventEmitter,
} from 'react-native/Libraries/Types/CodegenTypes';

// TODO:
//  Codegen results in a generate error for imported types.
//  To temporarily resolve this issue, copies of the types are kept here.
//  https://github.com/facebook/react-native/issues/38769
interface Core {
  id: string;
  url: string;
  path: string;
  headers?: UnsafeObject;
  metadata?: UnsafeObject;
}

namespace DownloadNs {
  type Status = 'idle' | 'working' | 'done' | 'fail';
  type Progress = {bytesDownload: number; bytesTotal: number};

  export interface Options extends Core {}

  export interface Task extends Options {
    type: 'download';
    status: Status;
    progress: Progress;
  }

  export type Event =
    | {type: 'begin'; id: string; bytesExpect: number}
    | {type: 'progress'; id: string; bytesDownload: number; bytesTotal: number}
    | {type: 'done'; id: string; bytesDownload: number; bytesTotal: number}
    | {type: 'fail'; id: string; error: string; errorCode: number};
}

namespace UploadNs {
  type Status = 'idle' | 'working' | 'done' | 'fail';
  type Progress = {bytesUpload: number; bytesTotal: number};

  export interface Options extends Core {}

  interface OptionsTask {
    status: Status;
    progress: Progress;
  }

  export interface Task extends Options, OptionsTask {
    type: 'upload';
  }

  export type Event =
    | {type: 'begin'; id: string; bytesExpect: number}
    | {type: 'progress'; id: string; bytesUpload: number; bytesTotal: number}
    | {type: 'done'; id: string; bytesUpload: number; bytesTotal: number}
    | {type: 'fail'; id: string; error: string; errorCode: number};
}

export interface Spec extends TurboModule {
  getDownloads(): DownloadNs.Task[];
  clearDownloads(): boolean;

  getDownload(id: string): DownloadNs.Task | undefined;
  createDownload(options: DownloadNs.Options): DownloadNs.Task;
  removeDownload(id: string): DownloadNs.Task;
  startDownload(id: string): void;
  stopDownload(id: string): void;
  readonly onDownload: EventEmitter<DownloadNs.Event>;

  getUploads(): UploadNs.Task[];
  clearUploads(): boolean;

  getUpload(id: string): UploadNs.Task | undefined;
  createUpload(options: UploadNs.Options): UploadNs.Task;
  removeUpload(id: string): UploadNs.Task;
  startUpload(id: string): void;
  stopUpload(id: string): void;
  readonly onUpload: EventEmitter<UploadNs.Event>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNTransfer');
