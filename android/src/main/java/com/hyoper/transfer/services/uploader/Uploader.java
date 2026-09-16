package com.hyoper.transfer.services.uploader;

import android.content.Context;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.google.gson.Gson;
import com.hyoper.transfer.helpers.RNTransferUtils;
import com.hyoper.transfer.services.uploader.models.UploadListener;
import com.hyoper.transfer.services.uploader.models.UploadTask;
import com.tencent.mmkv.MMKV;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class Uploader {
    public static final String NAME = "RNTransferUploader";
    private final Context context;
    private final MMKV storage;
    private final Gson gson = new Gson();
    private final Map<String, UploadTransfer> transfers = new ConcurrentHashMap<>();
    private final UploadQueue queue = new UploadQueue();
    private final UploadListener queueListener = new UploadListener() {
        @Override
        public void onBegin(String id, long bytesExpect) {
            UploadTransfer transfer = getUpload(id);
            if (transfer != null) {
                saveTransfer(transfer);
            }

            WritableMap map = Arguments.createMap();
            map.putString("type", "begin");
            map.putString("id", id);
            map.putDouble("bytesExpect", (double) bytesExpect);
            RNTransferUtils.emitUpload(map);
        }

        @Override
        public void onProgress(String id, long bytesUpload, long bytesTotal) {
            WritableMap map = Arguments.createMap();
            map.putString("type", "progress");
            map.putString("id", id);
            map.putDouble("bytesUpload", (double) bytesUpload);
            map.putDouble("bytesTotal", (double) bytesTotal);
            RNTransferUtils.emitUpload(map);
        }

        @Override
        public void onDone(String id, long bytesUpload, long bytesTotal) {
            UploadTransfer transfer = getUpload(id);
            if (transfer != null) {
                saveTransfer(transfer);
            }

            WritableMap map = Arguments.createMap();
            map.putString("type", "done");
            map.putString("id", id);
            map.putDouble("bytesUpload", (double) bytesUpload);
            map.putDouble("bytesTotal", (double) bytesTotal);
            RNTransferUtils.emitUpload(map);
        }

        @Override
        public void onFail(String id, Exception error) {
            UploadTransfer transfer = getUpload(id);
            if (transfer != null) {
                saveTransfer(transfer);
            }

            WritableMap map = Arguments.createMap();
            map.putString("type", "fail");
            map.putString("id", id);
            map.putString("error", error.toString());
            map.putInt("errorCode", error.hashCode());
            RNTransferUtils.emitUpload(map);
        }
    };

    public Uploader(Context context) {
        this.context = context.getApplicationContext();
        this.storage = MMKV.mmkvWithID(NAME);
        try {
            loadTransfers();
        } catch (Exception e) {
            clear();
        }

    }

    public List<UploadTransfer> getUploads() {
        return new ArrayList<>(this.transfers.values());
    }

    public @Nullable UploadTransfer getUpload(String id) {
        return this.transfers.get(id);
    }

    public UploadTransfer createUpload(UploadTask task) {
        UploadTransfer transfer = new UploadTransfer(task);
        UploadTransfer transferExist = this.transfers.putIfAbsent(transfer.id, transfer);
        if (transferExist != null) {
            throw new IllegalArgumentException("Upload ID duplication.");
        }

        saveTransfer(transfer);
        return transfer;
    }

    public @Nullable UploadTransfer removeUpload(String id) {
        UploadTransfer transfer = this.getUpload(id);

        if (transfer == null) return null;

        this.queue.delete(id);
        this.transfers.remove(id);
        removeTransfer(id);

        return transfer;
    }

    public void startUpload(String id) {
        UploadTransfer transfer = this.getUpload(id);

        if (transfer != null) {
            this.queue.add(transfer, this.queueListener);
        }
    }

    public void stopUpload(String id) {
        UploadTransfer transfer = this.getUpload(id);

        if (transfer != null) {
            this.queue.delete(id);
        }
    }

    public void clearMemory() {
        this.queue.clear();
        this.transfers.clear();
    }

    public void clear() {
        this.queue.clear();
        this.transfers.clear();
        this.storage.clearAll();
    }

    private void saveTransfer(UploadTransfer transfer) {
        String json = this.gson.toJson(transfer.toTask());
        this.storage.encode(transfer.id, json);
    }

    private void removeTransfer(String id) {
        this.storage.removeValueForKey(id);
    }

    private void loadTransfers() {
        String[] keys = this.storage.allKeys();
        if (keys == null) return;

        for (String key : keys) {
            String json = this.storage.decodeString(key);
            if (json == null || json.isEmpty()) continue;

            UploadTask task = this.gson.fromJson(json, UploadTask.class);
            if (task != null) {
                UploadTransfer transfer = new UploadTransfer(task);
                this.transfers.put(transfer.id, transfer);
            }
        }
    }
}
