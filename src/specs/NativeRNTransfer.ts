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
namespace TaskNs {
  type Status = 'idle' | 'working' | 'done' | 'fail';

  export type Options = {
    id: string;
    url: string;
    path: string;
    headers?: UnsafeObject;
    metadata?: UnsafeObject;
  };

  type Progress = {
    bytesDownloaded: number;
    bytesTotal: number;
  };

  type Core = {
    options: Options;
    status: Status;
    progress: Progress;
  };

  type TaskDownload = Core & {
    type: 'download';
  };

  type TaskUpload = Core & {
    type: 'upload';
  };

  export type Task = TaskDownload | TaskUpload;
}

namespace EventNs {
  export type OnBegin = {
    id: string;
    expectedBytes: number;
  };

  export type OnProgress = {
    id: string;
    bytesDownloaded: number;
    bytesTotal: number;
  };

  export type OnDone = {
    id: string;
    bytesDownloaded: number;
    bytesTotal: number;
  };

  export type OnError = {
    id: string;
    error: string;
    errorCode: number;
  };
}

export interface Spec extends TurboModule {
  configure(options: UnsafeObject): void;
  get(): Promise<TaskNs.Task[]>;
  download(options: TaskNs.Options): void;
  upload(options: TaskNs.Options): void;

  readonly onBegin: EventEmitter<EventNs.OnBegin>;
  readonly onProgress: EventEmitter<EventNs.OnProgress>;
  readonly onDone: EventEmitter<EventNs.OnDone>;
  readonly onError: EventEmitter<EventNs.OnError>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNTransfer');
