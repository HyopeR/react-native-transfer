package com.hyoper.transfer.uploader;

import com.hyoper.transfer.uploader.models.UploadTask;

public class UploaderTask extends UploadTask {
    public UploaderTask(UploadTask task) {
        super(task.id, task.url, task.path, task.headers, task.metadata, task.status, task.progress);
    }

    public void start() {}

    public void stop() {}
}
