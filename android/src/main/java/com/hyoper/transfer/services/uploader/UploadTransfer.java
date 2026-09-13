package com.hyoper.transfer.services.uploader;

import com.hyoper.transfer.services.uploader.models.UploadTask;

public class UploadTransfer extends UploadTask {
    public UploadTransfer(UploadTask task) {
        super(task.id, task.url, task.path, task.headers, task.metadata, task.status, task.progress);
    }

    public UploadTask toTask() {
        return new UploadTask(id, url, path, headers, metadata, status, progress);
    }
}
