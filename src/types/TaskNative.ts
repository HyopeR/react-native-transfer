export namespace TaskNativeNs {
  export type Options = {
    id: string;
    url: string;
    path: string;
    headers?: Record<string, any>;
    metadata?: Record<string, any>;
  };

  export type Status = 'idle' | 'working' | 'done' | 'fail';

  export type Progress = {
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
}
