package com.hyoper.transfer.services.downloader;

import android.content.Context;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
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
    }

    public List<DownloadTransfer> getDownloads() {
        return new ArrayList<>(transfers.values());
    }

    public @Nullable DownloadTransfer getDownload(String id) {
        return transfers.get(id);
    }

    public DownloadTransfer createDownload(DownloadTask task) {
        DownloadTransfer transfer = new DownloadTransfer(task);
        transfers.put(transfer.id, transfer);
        return transfer;
    }

    public @Nullable DownloadTransfer removeDownload(String id) {
        DownloadTransfer transfer = this.getDownload(id);

        if (transfer == null) return null;

        this.queue.delete(id);
        return transfers.remove(id);
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
}
