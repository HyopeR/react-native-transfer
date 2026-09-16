package com.hyoper.transfer.services.downloader;

import android.content.Context;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.hyoper.transfer.helpers.RNTransferUtils;
import com.hyoper.transfer.services.downloader.models.DownloadListener;
import com.hyoper.transfer.services.downloader.models.DownloadTask;
import com.tencent.mmkv.MMKV;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class Downloader {
    public static final String NAME = "RNTransferDownloader";
    private static final String STORAGE_KEY = "List";
    private final Context context;
    private final MMKV storage;
    private final Gson gson = new Gson();
    private final Map<String, DownloadTransfer> transfers = new ConcurrentHashMap<>();
    private final DownloadQueue queue = new DownloadQueue();
    private final DownloadListener queueListener = new DownloadListener() {
        @Override
        public void onBegin(String id, long bytesExpect) {
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
            WritableMap map = Arguments.createMap();
            map.putString("type", "done");
            map.putString("id", id);
            map.putDouble("bytesDownload", (double) bytesDownload);
            map.putDouble("bytesTotal", (double) bytesTotal);
            RNTransferUtils.emitDownload(map);
        }

        @Override
        public void onFail(String id, Exception error) {
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
            loadTransfers();
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

        saveTransfers();
        return transfer;
    }

    public @Nullable DownloadTransfer removeDownload(String id) {
        DownloadTransfer transfer = this.getDownload(id);

        if (transfer == null) return null;

        this.queue.delete(id);
        this.transfers.remove(id);
        saveTransfers();

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

    private synchronized void saveTransfers() {
        List<DownloadTask> tasks = new ArrayList<>();
        for (DownloadTransfer transfer : this.transfers.values()) {
            tasks.add(transfer.toTask());
        }
        String json = this.gson.toJson(tasks);
        this.storage.encode(STORAGE_KEY, json);
    }

    private void loadTransfers() {
        String json = this.storage.decodeString(STORAGE_KEY);
        if (json != null && !json.isEmpty()) {
            Type type = new TypeToken<List<DownloadTask>>() {}.getType();
            List<DownloadTask> tasks = this.gson.fromJson(json, type);

            if (tasks != null) {
                for (DownloadTask task : tasks) {
                    if (task.id != null) {
                        DownloadTransfer transfer = new DownloadTransfer(task);
                        this.transfers.put(transfer.id, transfer);
                    }
                }
            }
        }
    }
}
