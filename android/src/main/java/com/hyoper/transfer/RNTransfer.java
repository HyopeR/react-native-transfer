package com.hyoper.transfer;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;

import com.hyoper.transfer.helpers.RNTransferConverter;
import com.hyoper.transfer.helpers.RNTransferControl;
import com.hyoper.transfer.helpers.RNTransferUtils;
import com.hyoper.transfer.services.directory.Directory;
import com.hyoper.transfer.services.downloader.DownloadTransfer;
import com.hyoper.transfer.services.downloader.Downloader;
import com.hyoper.transfer.services.downloader.models.DownloadTask;
import com.hyoper.transfer.services.uploader.UploadTransfer;
import com.hyoper.transfer.services.uploader.Uploader;
import com.hyoper.transfer.services.uploader.models.UploadTask;
import com.tencent.mmkv.MMKV;

import java.util.List;

@ReactModule(name = RNTransfer.NAME)
public class RNTransfer extends NativeRNTransferSpec {
    public static final String NAME = "RNTransfer";
    private Downloader downloader = null;
    private Uploader uploader = null;

    public RNTransfer(ReactApplicationContext reactContext) {
        super(reactContext);
        MMKV.initialize(reactContext);
        downloader = new Downloader(reactContext);
        uploader = new Uploader(reactContext);
        RNTransferUtils.setName(NAME);
        RNTransferUtils.setEmitters(this::emitOnDownload, this::emitOnUpload);
    }

    @Override
    public void invalidate() {
        downloader.clearMemory();
        uploader.clearMemory();
        downloader = null;
        uploader = null;
        RNTransferUtils.reset();
    }

    @NonNull
    @Override
    public String getName() {
        return NAME;
    }

    @Override
    @NonNull
    public WritableMap getDirectories() {
        return Directory.getDirectories(getReactApplicationContext());
    }

    @Override
    public WritableArray getDownloads() {
        List<DownloadTransfer> transfers = downloader.getDownloads();
        return RNTransferConverter.mapFromDownloadTasks(transfers);
    }

    @Override
    public void clearDownloads() {
        downloader.clear();
    }


    @Nullable
    @Override
    public WritableMap getDownload(String id) {
        DownloadTransfer transfer = this.downloader.getDownload(id);
        if (transfer != null) {
            return RNTransferConverter.mapFromDownloadTask(transfer);
        } else {
            return null;
        }
    }

    @Override
    public WritableMap createDownload(ReadableMap options) {
        RNTransferControl.ensureOptions(options);
        DownloadTask task = RNTransferConverter.mapToDownloadTask(options);
        DownloadTransfer transfer = this.downloader.createDownload(task);
        return RNTransferConverter.mapFromDownloadTask(transfer);
    }

    @Nullable
    @Override
    public WritableMap removeDownload(String id) {
        DownloadTransfer transfer = this.downloader.removeDownload(id);
        if (transfer != null) {
            return RNTransferConverter.mapFromDownloadTask(transfer);
        } else {
            return null;
        }
    }

    @Override
    public void startDownload(String id) {
        this.downloader.startDownload(id);
    }

    @Override
    public void stopDownload(String id) {
        this.downloader.stopDownload(id);
    }

    @Override
    public WritableArray getUploads() {
        List<UploadTransfer> transfers = uploader.getUploads();
        return RNTransferConverter.mapFromUploadTasks(transfers);
    }

    @Override
    public void clearUploads() {
        uploader.clear();
    }

    @Nullable
    @Override
    public WritableMap getUpload(String id) {
        UploadTransfer transfer = this.uploader.getUpload(id);
        if (transfer != null) {
            return RNTransferConverter.mapFromUploadTask(transfer);
        } else {
            return null;
        }
    }

    @Override
    public WritableMap createUpload(ReadableMap options) {
        RNTransferControl.ensureOptions(options);
        UploadTask task = RNTransferConverter.mapToUploadTask(options);
        UploadTransfer transfer = this.uploader.createUpload(task);
        return RNTransferConverter.mapFromUploadTask(transfer);
    }

    @Nullable
    @Override
    public WritableMap removeUpload(String id) {
        UploadTransfer transfer = this.uploader.removeUpload(id);
        if (transfer != null) {
            return RNTransferConverter.mapFromUploadTask(transfer);
        } else {
            return null;
        }
    }

    @Override
    public void startUpload(String id) {
        this.uploader.startUpload(id);
    }

    @Override
    public void stopUpload(String id) {
        this.uploader.stopUpload(id);
    }
}
