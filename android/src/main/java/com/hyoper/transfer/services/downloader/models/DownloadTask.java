package com.hyoper.transfer.services.downloader.models;

import androidx.annotation.Nullable;

import java.util.Map;

public class DownloadTask {
    public final String id;
    public final String url;
    public final String path;

    @Nullable
    public final Map<String, ?> headers;

    @Nullable
    public final Map<String, ?> metadata;

    public final String type = "download";
    public DownloadStatus status;
    public DownloadProgress progress;

    public DownloadTask(
            String id,
            String url,
            String path,
            @Nullable Map<String, ?> headers,
            @Nullable Map<String, ?> metadata,
            DownloadStatus status,
            DownloadProgress progress
    ) {
        this.id = id;
        this.url = url;
        this.path = path;
        this.headers = headers;
        this.metadata = metadata;
        this.status = status;
        this.progress = progress;
    }

    public DownloadTask(
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
        this.status = DownloadStatus.IDLE;
        this.progress = new DownloadProgress();
    }
}