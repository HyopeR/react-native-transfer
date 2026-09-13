package com.hyoper.transfer.services.downloader;

import com.hyoper.transfer.services.downloader.models.DownloadProgress;
import com.hyoper.transfer.services.downloader.models.DownloadStatus;
import com.hyoper.transfer.services.downloader.models.DownloadTask;

public class DownloadTransfer extends DownloadTask {
    public DownloadTransfer(DownloadTask task) {
        super(task.id, task.url, task.path, task.headers, task.metadata, task.status, task.progress);
    }

    public DownloadTask toTask() {
        return new DownloadTask(id, url, path, headers, metadata, status, progress);
    }

    public void setStatus(String status) {
        switch (status) {
            case "idle" -> this.status = DownloadStatus.IDLE;
            case "working" -> this.status = DownloadStatus.WORKING;
            case "done" -> this.status = DownloadStatus.DONE;
            case "fail" -> this.status = DownloadStatus.FAIL;
        }
    }

    public void setProgress(long bytesDownload, long bytesTotal) {
        this.progress = new DownloadProgress(bytesDownload, bytesTotal);
    }
}