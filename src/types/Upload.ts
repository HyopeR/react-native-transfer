import {Core, CoreStatus} from './Core';

export namespace UploadNs {
  export type Status = CoreStatus;

  export type Progress = {
    bytesUpload: number;
    bytesTotal: number;
  };

  export interface Options extends Core {}

  export interface OptionsTask {
    status: Status;
    progress: Progress;
  }

  export interface Task extends Options, OptionsTask {
    type: 'upload';
  }

  export type Event =
    | {
        type: 'begin';
        id: string;
        bytesExpect: number;
      }
    | {
        type: 'progress';
        id: string;
        bytesUpload: number;
        bytesTotal: number;
      }
    | {
        type: 'done';
        id: string;
        bytesUpload: number;
        bytesTotal: number;
      }
    | {
        type: 'fail';
        id: string;
        error: string;
        errorCode: number;
      };
}
