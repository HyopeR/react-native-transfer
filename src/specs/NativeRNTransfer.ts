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

type DownloadStatus = 'idle' | 'working' | 'done' | 'fail';

type DownloadProgress = {bytesDownload: number; bytesTotal: number};

interface DownloadOptions extends Core {}

interface DownloadTask extends DownloadOptions {
  type: 'download';
  status: DownloadStatus;
  progress: DownloadProgress;
}

type DownloadEvent =
  | {type: 'begin'; id: string; bytesExpect: number}
  | {type: 'progress'; id: string; bytesDownload: number; bytesTotal: number}
  | {type: 'done'; id: string; bytesDownload: number; bytesTotal: number}
  | {type: 'fail'; id: string; error: string; errorCode: number};

type UploadStatus = 'idle' | 'working' | 'done' | 'fail';

type UploadProgress = {bytesUpload: number; bytesTotal: number};

interface UploadOptions extends Core {}

export interface UploadTask extends UploadOptions {
  type: 'upload';
  status: UploadStatus;
  progress: UploadProgress;
}

export type UploadEvent =
  | {type: 'begin'; id: string; bytesExpect: number}
  | {type: 'progress'; id: string; bytesUpload: number; bytesTotal: number}
  | {type: 'done'; id: string; bytesUpload: number; bytesTotal: number}
  | {type: 'fail'; id: string; error: string; errorCode: number};

export interface Spec extends TurboModule {
  getDownloads(): DownloadTask[];
  clearDownloads(): boolean;

  getDownload(id: string): DownloadTask | undefined;
  createDownload(options: DownloadOptions): DownloadTask;
  removeDownload(id: string): DownloadTask;
  startDownload(id: string): void;
  stopDownload(id: string): void;
  readonly onDownload: EventEmitter<DownloadEvent>;

  getUploads(): UploadTask[];
  clearUploads(): boolean;

  getUpload(id: string): UploadTask | undefined;
  createUpload(options: UploadOptions): UploadTask;
  removeUpload(id: string): UploadTask;
  startUpload(id: string): void;
  stopUpload(id: string): void;
  readonly onUpload: EventEmitter<UploadEvent>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNTransfer');
