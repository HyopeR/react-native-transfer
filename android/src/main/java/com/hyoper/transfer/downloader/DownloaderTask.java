package com.hyoper.transfer.downloader;

import com.hyoper.transfer.downloader.models.DownloadTask;

public class DownloaderTask extends DownloadTask {
    public DownloaderTask(DownloadTask task) {
        super(task.id, task.url, task.path, task.headers, task.metadata, task.status, task.progress);
    }

    public void start() {}

    public void stop() {}
}