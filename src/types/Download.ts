import {Core} from './Core';

export namespace DownloadNs {
  export type Status = 'idle' | 'working' | 'done' | 'fail';

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

  export type EventMap = {
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

  export type EventType = keyof EventMap;

  export type Event = EventMap[EventType];

  export type EventListener<T extends EventType> = (event: EventMap[T]) => void;

  export type EventListenerMap = {
    [T in EventType]: Set<EventListener<T>>;
  };

  export interface Transfer extends Task {
    on<T extends EventType>(type: T, listener: EventListener<T>): this;
    start(): void;
    stop(): void;
    remove(): void;
  }

  export interface TransferInternal extends Transfer {
    apply(event: Event): void;
  }

  export interface TransferHandlers {
    remove: (id: string) => void;
  }
}
