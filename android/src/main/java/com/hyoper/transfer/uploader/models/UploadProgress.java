package com.hyoper.transfer.uploader.models;

public class UploadProgress {
    public final long bytesUpload;
    public final long bytesTotal;

    public UploadProgress(long bytesUpload, long bytesTotal) {
        this.bytesUpload = bytesUpload;
        this.bytesTotal = bytesTotal;
    }

    public UploadProgress() {
        this.bytesUpload = 0;
        this.bytesTotal = 0;
    }
}