package com.hyoper.transfer.services.uploader.models;

public interface UploadListener {
    void onBegin(String id, long bytesExpect);

    void onProgress(String id, long bytesUpload, long bytesTotal);

    void onDone(String id, long bytesUpload, long bytesTotal);

    void onFail(String id, Exception error);
}