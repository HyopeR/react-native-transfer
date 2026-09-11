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

  export type EventMap = {
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
