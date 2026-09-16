package com.hyoper.transfer;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;

import com.hyoper.transfer.helpers.RNTransferConverter;
import com.hyoper.transfer.helpers.RNTransferConverterGuard;
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
    public void clearDownloads(Promise promise) {
        downloader.clear();
        promise.resolve(true);
    }

    @Override
    public WritableMap createDownload(ReadableMap options) {
        RNTransferConverterGuard.ensureMapTo(options);
        DownloadTask taskRaw = RNTransferConverter.mapToDownloadTask(options);
        DownloadTransfer transfer = this.downloader.createDownload(taskRaw);
        return RNTransferConverter.mapFromDownloadTask(transfer);
    }

    @Override
    public void removeDownload(String id, Promise promise) {
        DownloadTransfer transfer = this.downloader.removeDownload(id);
        if (transfer != null) {
            WritableMap taskMap = RNTransferConverter.mapFromDownloadTask(transfer);
            promise.resolve(taskMap);
        } else {
            promise.resolve(null);
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
        return null;
    }

    @Override
    public void clearUploads(Promise promise) {
        promise.resolve(true);
    }

    @Override
    public WritableMap createUpload(ReadableMap options) {
        RNTransferConverterGuard.ensureMapTo(options);
        UploadTask task = RNTransferConverter.mapToUploadTask(options);
        UploadTransfer transfer = this.uploader.create(task);
        return RNTransferConverter.mapFromUploadTask(transfer);
    }

    @Override
    public void removeUpload(String id, Promise promise) {
        UploadTransfer transfer = this.uploader.remove(id);
        if (transfer != null) {
            WritableMap taskMap = RNTransferConverter.mapFromUploadTask(transfer);
            promise.resolve(taskMap);
        } else {
            promise.resolve(null);
        }
    }

    @Override
    public void startUpload(String id) {

    }

    @Override
    public void stopUpload(String id) {

    }
}
