export type UploadEventMap = {
  begin: {
    type: 'begin';
    id: string;
    bytesExpect: number;
  };
  progress: {
    type: 'progress';
    id: string;
    bytesUpload: number;
    bytesTotal: number;
  };
  done: {
    type: 'done';
    id: string;
    bytesUpload: number;
    bytesTotal: number;
  };
  fail: {
    type: 'fail';
    id: string;
    error: string;
    errorCode: number;
  };
};

export type UploadEventType = keyof UploadEventMap;

export type UploadEvent = UploadEventMap[UploadEventType];

export type UploadEventListener<T extends UploadEventType> = (
  event: UploadEventMap[T],
) => void;

export type UploadEventListenerMap = {
  [K in UploadEventType]: UploadEventListener<K>;
};
