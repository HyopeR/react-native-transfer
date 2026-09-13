package com.hyoper.transfer.services.downloader;

import android.content.Context;

import androidx.annotation.Nullable;

import com.hyoper.transfer.services.downloader.models.DownloadTask;
import com.tencent.mmkv.MMKV;

import java.util.HashMap;
import java.util.Map;

public class Downloader {
    private final Context context;
    private final MMKV storage;
    private final Map<String, DownloadTransfer> transfers = new HashMap<>();

    public Downloader(Context context, MMKV storage) {
        this.context = context.getApplicationContext();
        this.storage = storage;
    }

    public DownloadTransfer create(DownloadTask task) {
        DownloadTransfer transfer = new DownloadTransfer(task);
        transfers.put(transfer.id, transfer);
        return transfer;
    }

    public @Nullable DownloadTransfer remove(String id) {
        return transfers.remove(id);
    }

    public @Nullable DownloadTransfer get(String id) {
        return transfers.get(id);
    }
}
