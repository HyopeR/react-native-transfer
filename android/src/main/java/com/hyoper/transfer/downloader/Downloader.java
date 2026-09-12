package com.hyoper.transfer.downloader;

import android.content.Context;

import java.util.HashMap;
import java.util.Map;

public class Downloader {
    private final Context context;
    private final Map<String, DownloaderTask> tasks = new HashMap<>();

    public Downloader(Context context) {
        this.context = context.getApplicationContext();
    }
}
