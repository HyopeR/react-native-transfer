package com.hyoper.transfer;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;

import com.hyoper.transfer.helpers.RNTransferConverter;
import com.hyoper.transfer.helpers.RNTransferConverterGuard;
import com.hyoper.transfer.helpers.RNTransferUtils;
import com.hyoper.transfer.services.downloader.DownloadTransfer;
import com.hyoper.transfer.services.downloader.Downloader;
import com.hyoper.transfer.services.downloader.models.DownloadTask;
import com.hyoper.transfer.services.uploader.UploadTransfer;
import com.hyoper.transfer.services.uploader.Uploader;
import com.hyoper.transfer.services.uploader.models.UploadTask;
import com.tencent.mmkv.MMKV;

@ReactModule(name = RNTransfer.NAME)
public class RNTransfer extends NativeRNTransferSpec {
    public static final String NAME = "RNTransfer";
    private Downloader downloader = null;
    private Uploader uploader = null;

    public RNTransfer(ReactApplicationContext reactContext) {
        super(reactContext);
        MMKV.initialize(reactContext);
        MMKV storage = MMKV.mmkvWithID(NAME);
        downloader = new Downloader(reactContext, storage);
        uploader = new Uploader(reactContext, storage);
        RNTransferUtils.setName(NAME);
    }

    @Override
    public void invalidate() {
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
    public WritableArray getDownloads() {
        return null;
    }

    @Override
    public boolean clearDownloads() {
        return false;
    }

    @Override
    public WritableMap createDownload(ReadableMap options) {
        try {
            RNTransferConverterGuard.ensureMapTo(options);
            DownloadTask taskRaw = RNTransferConverter.mapToDownloadTask(options);
            DownloadTransfer transfer = this.downloader.create(taskRaw);
            DownloadTask task = transfer.toTask();
            return RNTransferConverter.mapFromDownloadTask(task);
        } catch (Exception e) {
            return null;
        }
    }

    @Nullable
    @Override
    public WritableMap removeDownload(String id) {
        try {
            DownloadTransfer transfer = this.downloader.remove(id);
            RNTransferConverterGuard.ensureMapFrom(transfer);
            DownloadTask task = transfer.toTask();
            return RNTransferConverter.mapFromDownloadTask(task);
        } catch (Exception e) {
            return null;
        }
    }

    @Nullable
    @Override
    public WritableMap getDownload(String id) {
        try {
            DownloadTransfer transfer = this.downloader.get(id);
            RNTransferConverterGuard.ensureMapFrom(transfer);
            DownloadTask task = transfer.toTask();
            return RNTransferConverter.mapFromDownloadTask(task);
        } catch (Exception e) {
            return null;
        }
    }


    @Override
    public void startDownload(String id) {

    }

    @Override
    public void stopDownload(String id) {

    }

    @Override
    public WritableArray getUploads() {
        return null;
    }

    @Override
    public boolean clearUploads() {
        return false;
    }

    @Override
    public WritableMap createUpload(ReadableMap options) {
        try {
            RNTransferConverterGuard.ensureMapTo(options);
            UploadTask taskRaw = RNTransferConverter.mapToUploadTask(options);
            UploadTransfer transfer = this.uploader.create(taskRaw);
            UploadTask task = transfer.toTask();
            return RNTransferConverter.mapFromUploadTask(task);
        } catch (Exception e) {
            return null;
        }
    }

    @Nullable
    @Override
    public WritableMap removeUpload(String id) {
        try {
            UploadTransfer transfer = this.uploader.remove(id);
            RNTransferConverterGuard.ensureMapFrom(transfer);
            UploadTask task = transfer.toTask();
            return RNTransferConverter.mapFromUploadTask(task);
        } catch (Exception e) {
            return null;
        }
    }

    @Nullable
    @Override
    public WritableMap getUpload(String id) {
        try {
            UploadTransfer transfer = this.uploader.get(id);
            RNTransferConverterGuard.ensureMapFrom(transfer);
            UploadTask task = transfer.toTask();
            return RNTransferConverter.mapFromUploadTask(task);
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public void startUpload(String id) {

    }

    @Override
    public void stopUpload(String id) {

    }
}
