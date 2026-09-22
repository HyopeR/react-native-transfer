import {EventSubscription} from 'react-native';
import {Core} from './Core';
import {DownloadEvent, DownloadEventListenerMap} from './DownloadEvent';
import {
  DownloadSubscription,
  DownloadSubscriptionInternal,
} from './DownloadSubscription';

/** External */

export type DownloadStatus = 'idle' | 'working' | 'done' | 'fail';

export type DownloadProgress = {
  bytesDownload: number;
  bytesTotal: number;
};

export interface DownloadOptions extends Core {}

export interface DownloadTask extends DownloadOptions {
  type: 'download';
  status: DownloadStatus;
  progress: DownloadProgress;
}

export interface DownloadTransfer extends DownloadTask {
  start(): void;
  stop(): void;
  remove(): void;
  subscribe(listeners: Partial<DownloadEventListenerMap>): DownloadSubscription;
  unsubscribe(id: string): void;
}

/** Internal */

export interface DownloadTransferInternal extends DownloadTransfer {
  apply(event: DownloadEvent): void;
}

export interface DownloadTransferInternalHandlers {
  remove: (id: string) => void;
}

export type DownloadTransferInternalSubscriptions = Map<
  string,
  DownloadSubscriptionInternal
>;

export type DownloaderSubscription = EventSubscription;
