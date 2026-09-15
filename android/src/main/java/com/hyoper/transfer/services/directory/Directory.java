package com.hyoper.transfer.services.directory;

import android.content.Context;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

public class Directory {
    public static WritableMap getDirectories(Context context) {
        WritableMap directories = Arguments.createMap();
        directories.putString("app", context.getFilesDir().getAbsolutePath());
        directories.putString("cache", context.getCacheDir().getAbsolutePath());
        return directories;
    }
}
