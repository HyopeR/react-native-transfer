package com.hyoper.transfer.helpers;

import android.content.Context;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

public class RNTransferDirectories {
    private static final String TAG = "RNTransferDirectories";

    public static WritableMap getDirectories(Context context) {
        WritableMap directories = Arguments.createMap();
        directories.putString("app", context.getFilesDir().getAbsolutePath());
        directories.putString("cache", context.getCacheDir().getAbsolutePath());
        return directories;
    }
}