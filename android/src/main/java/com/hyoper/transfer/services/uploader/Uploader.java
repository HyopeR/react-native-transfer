package com.hyoper.transfer.services.uploader;

import android.content.Context;

import androidx.annotation.Nullable;

import com.hyoper.transfer.services.uploader.models.UploadTask;
import com.tencent.mmkv.MMKV;

import java.util.HashMap;
import java.util.Map;

public class Uploader {
    public static final String NAME = "RNTransferUploader";
    private final Context context;
    private final MMKV storage;
    private final Map<String, UploadTransfer> transfers = new HashMap<>();

    public Uploader(Context context) {
        this.context = context.getApplicationContext();
        this.storage = MMKV.mmkvWithID(NAME);
    }

    public UploadTransfer create(UploadTask task) {
        UploadTransfer transfer = new UploadTransfer(task);
        transfers.put(transfer.id, transfer);
        return transfer;
    }

    public @Nullable UploadTransfer remove(String id) {
        return transfers.remove(id);
    }

    public @Nullable UploadTransfer get(String id) {
        return transfers.get(id);
    }
}
