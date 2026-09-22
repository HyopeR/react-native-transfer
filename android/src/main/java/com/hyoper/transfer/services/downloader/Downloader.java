package com.hyoper.transfer.services.downloader;

import android.content.Context;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.google.gson.Gson;
import com.hyoper.transfer.helpers.RNTransferUtils;
import com.hyoper.transfer.services.downloader.models.DownloadListener;
import com.hyoper.transfer.services.downloader.models.DownloadTask;
import com.tencent.mmkv.MMKV;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class Downloader {
    public static final String NAME = "RNTransferDownloader";
    private final Context context;
    private final MMKV storage;
    private final Gson gson = new Gson();
    private final Map<String, DownloadTransfer> transfers = new ConcurrentHashMap<>();
    private final DownloadQueue queue = new DownloadQueue();
    private final DownloadListener queueListener = new DownloadListener() {
        @Override
        public void onBegin(String id, long bytesExpect) {
            DownloadTransfer transfer = getDownload(id);
            if (transfer != null) {
                saveTransfer(transfer);
            }

            WritableMap map = Arguments.createMap();
            map.putString("type", "begin");
            map.putString("id", id);
            map.putDouble("bytesExpect", (double) bytesExpect);
            RNTransferUtils.emitDownload(map);
        }

        @Override
        public void onProgress(String id, long bytesDownload, long bytesTotal) {
            WritableMap map = Arguments.createMap();
            map.putString("type", "progress");
            map.putString("id", id);
            map.putDouble("bytesDownload", (double) bytesDownload);
            map.putDouble("bytesTotal", (double) bytesTotal);
            RNTransferUtils.emitDownload(map);
        }

        @Override
        public void onDone(String id, long bytesDownload, long bytesTotal) {
            DownloadTransfer transfer = getDownload(id);
            if (transfer != null) {
                saveTransfer(transfer);
            }

            WritableMap map = Arguments.createMap();
            map.putString("type", "done");
            map.putString("id", id);
            map.putDouble("bytesDownload", (double) bytesDownload);
            map.putDouble("bytesTotal", (double) bytesTotal);
            RNTransferUtils.emitDownload(map);
        }

        @Override
        public void onFail(String id, Exception error) {
            DownloadTransfer transfer = getDownload(id);
            if (transfer != null) {
                saveTransfer(transfer);
            }

            WritableMap map = Arguments.createMap();
            map.putString("type", "fail");
            map.putString("id", id);
            map.putString("error", error.toString());
            map.putInt("errorCode", error.hashCode());
            RNTransferUtils.emitDownload(map);
        }
    };

    public Downloader(Context context) {
        this.context = context.getApplicationContext();
        this.storage = MMKV.mmkvWithID(NAME);
        try {
            this.loadTransfers();
        } catch (Exception e) {
            clear();
        }

    }

    public List<DownloadTransfer> getDownloads() {
        return new ArrayList<>(this.transfers.values());
    }

    public @Nullable DownloadTransfer getDownload(String id) {
        return this.transfers.get(id);
    }

    public DownloadTransfer createDownload(DownloadTask task) {
        DownloadTransfer transfer = new DownloadTransfer(task);
        DownloadTransfer transferExist = this.transfers.putIfAbsent(transfer.id, transfer);
        if (transferExist != null) {
            throw new IllegalArgumentException("Download ID duplication.");
        }

        this.saveTransfer(transfer);
        return transfer;
    }

    public @Nullable DownloadTransfer removeDownload(String id) {
        DownloadTransfer transfer = this.getDownload(id);

        if (transfer == null) return null;

        this.queue.delete(id);
        this.transfers.remove(id);
        this.removeTransfer(id);

        return transfer;
    }

    public void startDownload(String id) {
        DownloadTransfer transfer = this.getDownload(id);

        if (transfer != null) {
            this.queue.add(transfer, this.queueListener);
        }
    }

    public void stopDownload(String id) {
        DownloadTransfer transfer = this.getDownload(id);

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

    private void saveTransfer(DownloadTransfer transfer) {
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

            DownloadTask task = this.gson.fromJson(json, DownloadTask.class);
            if (task != null) {
                DownloadTransfer transfer = new DownloadTransfer(task);
                this.transfers.put(transfer.id, transfer);
            }
        }
    }
}
