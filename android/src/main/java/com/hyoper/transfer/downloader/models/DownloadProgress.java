package com.hyoper.transfer.downloader.models;

public class DownloadProgress {
    public final long bytesDownload;
    public final long bytesTotal;

    public DownloadProgress(long bytesDownload, long bytesTotal) {
        this.bytesDownload = bytesDownload;
        this.bytesTotal = bytesTotal;
    }

    public DownloadProgress() {
        this.bytesDownload = 0;
        this.bytesTotal = 0;
    }
}