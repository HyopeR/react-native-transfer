package com.hyoper.transfer.helpers;

import com.facebook.react.bridge.ReadableMap;

public class RNTransferUtils {
    public interface Emitter {
        void emit(ReadableMap value);
    }

    public static String name = "RNTransfer";
    private static Emitter onDownloadEmitter = null;
    private static Emitter onUploadEmitter = null;

    public static void setName(String _name) {
        name = _name;
    }

    public static void setEmitters(Emitter _onDownloadEmitter, Emitter _onUploadEmitter) {
        onDownloadEmitter = _onDownloadEmitter;
        onUploadEmitter = _onUploadEmitter;
    }

    public static void emitDownload(ReadableMap body) {
        if (onDownloadEmitter == null) return;
        onDownloadEmitter.emit(body);
    }

    public static void emitUpload(ReadableMap body) {
        if (onUploadEmitter == null) return;
        onUploadEmitter.emit(body);
    }

    public static void reset() {
        name = "RNTransfer";
        onDownloadEmitter = null;
        onUploadEmitter = null;
    }
}
