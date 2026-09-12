package com.hyoper.transfer.uploader;

import android.content.Context;

import java.util.HashMap;
import java.util.Map;

public class Uploader {
    private final Context context;
    private final Map<String, UploaderTask> tasks = new HashMap<>();

    public Uploader(Context context) {
        this.context = context.getApplicationContext();
    }
}
