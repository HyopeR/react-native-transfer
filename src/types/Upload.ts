import {EventSubscription} from 'react-native';
import {Core} from './Core';
import {UploadEvent, UploadEventListenerMap} from './UploadEvent';
import {
  UploadSubscription,
  UploadSubscriptionInternal,
} from './UploadSubscription';

/** External */

export type UploadStatus = 'idle' | 'working' | 'done' | 'fail';

export type UploadProgress = {
  bytesUpload: number;
  bytesTotal: number;
};

export interface UploadOptions extends Core {}

export interface UploadTask extends UploadOptions {
  type: 'upload';
  status: UploadStatus;
  progress: UploadProgress;
}

export interface UploadTransfer extends UploadTask {
  start(): void;
  stop(): void;
  remove(): Promise<void>;
  subscribe(listeners: Partial<UploadEventListenerMap>): UploadSubscription;
  unsubscribe(id: string): void;
}

/** Internal */

export interface UploadTransferInternal extends UploadTransfer {
  apply(event: UploadEvent): void;
}

export interface UploadTransferInternalHandlers {
  remove: (id: string) => Promise<void>;
}

export type UploadTransferInternalSubscriptions = Map<
  string,
  UploadSubscriptionInternal
>;

export type UploaderSubscription = EventSubscription;
