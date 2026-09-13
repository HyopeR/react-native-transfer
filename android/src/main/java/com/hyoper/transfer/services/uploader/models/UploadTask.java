package com.hyoper.transfer.services.uploader.models;

import androidx.annotation.Nullable;

import java.util.Map;

public class UploadTask {
    public final String id;
    public final String url;
    public final String path;

    @Nullable
    public final Map<String, ?> headers;

    @Nullable
    public final Map<String, ?> metadata;

    public final String type = "upload";
    public UploadStatus status;
    public UploadProgress progress;

    public UploadTask(
            String id,
            String url,
            String path,
            @Nullable Map<String, ?> headers,
            @Nullable Map<String, ?> metadata,
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
            @Nullable Map<String, ?> headers,
            @Nullable Map<String, ?> metadata
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