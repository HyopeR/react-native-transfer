export type DownloadEventMap = {
  begin: {
    type: 'begin';
    id: string;
    bytesExpect: number;
  };
  progress: {
    type: 'progress';
    id: string;
    bytesDownload: number;
    bytesTotal: number;
  };
  done: {
    type: 'done';
    id: string;
    bytesDownload: number;
    bytesTotal: number;
  };
  fail: {
    type: 'fail';
    id: string;
    error: string;
    errorCode: number;
  };
};

export type DownloadEventType = keyof DownloadEventMap;

export type DownloadEvent = DownloadEventMap[DownloadEventType];

export type DownloadEventListener<T extends DownloadEventType> = (
  event: DownloadEventMap[T],
) => void;

export type DownloadEventListenerMap = {
  [K in DownloadEventType]: DownloadEventListener<K>;
};
