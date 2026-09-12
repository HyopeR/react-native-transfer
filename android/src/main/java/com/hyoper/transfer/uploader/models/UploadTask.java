package com.hyoper.transfer.uploader.models;

import androidx.annotation.Nullable;

import java.util.Map;

public class UploadTask {
    public final String id;
    public final String url;
    public final String path;

    @Nullable
    public final Map<String, Object> headers;

    @Nullable
    public final Map<String, Object> metadata;

    public UploadStatus status;
    public UploadProgress progress;

    public UploadTask(
            String id,
            String url,
            String path,
            @Nullable Map<String, Object> headers,
            @Nullable Map<String, Object> metadata,
            UploadStatus status,
            UploadProgress progress
    ) {
        this.id = id;
        this.url = url;
        this.path = path;
        this.headers = headers;
        this.metadata = metadata;
        this.status = status;
        this.progress = progress;
    }

    public UploadTask(
            String id,
            String url,
            String path,
            @Nullable Map<String, Object> headers,
            @Nullable Map<String, Object> metadata
    ) {
        this.id = id;
        this.url = url;
        this.path = path;
        this.headers = headers;
        this.metadata = metadata;
        this.status = UploadStatus.IDLE;
        this.progress = new UploadProgress();
    }
}