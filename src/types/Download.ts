import {Core, CoreStatus} from './Core';

export namespace DownloadNs {
  export type Status = CoreStatus;

  export type Progress = {
    bytesDownload: number;
    bytesTotal: number;
  };

  export interface Options extends Core {}

  export interface OptionsTask {
    status: Status;
    progress: Progress;
  }

  export interface Task extends Options, OptionsTask {
    type: 'download';
  }

  export interface Transfer extends Task {
    start(): void;
    stop(): void;
    apply(event: Event): void;
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
        bytesDownload: number;
        bytesTotal: number;
      }
    | {
        type: 'done';
        id: string;
        bytesDownload: number;
        bytesTotal: number;
      }
    | {
        type: 'fail';
        id: string;
        error: string;
        errorCode: number;
      };
}
