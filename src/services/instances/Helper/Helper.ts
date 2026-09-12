import RNTransferNative from '../../../specs/NativeRNTransfer';

export class Helper {
  get directories() {
    return {
      app: '', // RNTransferNative.directories.app
      cache: '', // RNTransferNative.directories.cache
      documents: '', // RNTransferNative.directories.documents
    };
  }

  uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, char => {
      const random = Math.floor(Math.random() * 16);
      const value = char === 'x' ? random : (random % 4) + 8;
      return value.toString(16);
    });
  }
}
