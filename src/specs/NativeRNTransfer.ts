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
  export type Options = {
    id: string;
    url: string;
    path: string;
    headers?: UnsafeObject;
    metadata?: UnsafeObject;
  };

  type Status = 'idle' | 'working' | 'done' | 'fail';

  type Progress = {
    bytesDownloaded: number;
    bytesTotal: number;
  };

  export interface Core {
    options: Options;
    status: Status;
    progress: Progress;
  }

  export interface CoreDownload extends Core {
    type: 'download';
  }

  export interface CoreUpload extends Core {
    type: 'upload';
  }

  export type Task = CoreDownload | CoreUpload;
}

namespace EventNs {
  export type OnBeginParams = {
    id: string;
    expectedBytes: number;
  };

  export type OnProgressParams = {
    id: string;
    bytesDownloaded: number;
    bytesTotal: number;
  };

  export type OnDoneParams = {
    id: string;
    bytesDownloaded: number;
    bytesTotal: number;
  };

  export type OnErrorParams = {
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

  readonly onBegin: EventEmitter<EventNs.OnBeginParams>;
  readonly onProgress: EventEmitter<EventNs.OnProgressParams>;
  readonly onDone: EventEmitter<EventNs.OnDoneParams>;
  readonly onError: EventEmitter<EventNs.OnErrorParams>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNTransfer');
