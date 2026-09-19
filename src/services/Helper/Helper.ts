import RNTransferNative from '../../../specs/NativeRNTransfer';
import {uuid} from '../../../utils';

export class Helper {
  get directories() {
    return RNTransferNative.getDirectories();
  }

  uuid() {
    return uuid();
  }
}
