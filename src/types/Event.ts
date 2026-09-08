export type OnBegin = (params: OnBeginParams) => void;
export type OnBeginParams = {
  id: string;
  expectedBytes: number;
};

export type OnProgress = (params: OnProgressParams) => void;
export type OnProgressParams = {
  id: string;
  bytesDownloaded: number;
  bytesTotal: number;
};

export type OnDone = (params: OnDoneParams) => void;
export type OnDoneParams = {
  id: string;
  bytesDownloaded: number;
  bytesTotal: number;
};

export type OnError = (params: OnErrorParams) => void;
export type OnErrorParams = {
  id: string;
  error: string;
  errorCode: number;
};
