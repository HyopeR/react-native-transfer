package com.hyoper.transfer.services.downloader.models;

public interface DownloadCallback {
    void onBegin(String id, long bytesExpect);

    void onProgress(String id, long bytesDownload, long bytesTotal);

    void onDone(String id, long bytesDownload, long bytesTotal);

    void onFail(String id, Exception error);
}