package com.hyoper.transfer.services.uploader;

import com.hyoper.transfer.services.uploader.models.UploadProgress;
import com.hyoper.transfer.services.uploader.models.UploadStatus;
import com.hyoper.transfer.services.uploader.models.UploadTask;

public class UploadTransfer extends UploadTask {
    public UploadTransfer(UploadTask task) {
        super(task.id, task.url, task.path, task.headers, task.metadata, task.status, task.progress);
    }

    public UploadTask toTask() {
        return new UploadTask(id, url, path, headers, metadata, status, progress);
    }

    public void setStatus(String status) {
        switch (status) {
            case "idle" -> this.status = UploadStatus.IDLE;
            case "working" -> this.status = UploadStatus.WORKING;
            case "done" -> this.status = UploadStatus.DONE;
            case "fail" -> this.status = UploadStatus.FAIL;
        }
    }

    public void setProgress(long bytesUpload, long bytesTotal) {
        this.progress = new UploadProgress(bytesUpload, bytesTotal);
    }
}
