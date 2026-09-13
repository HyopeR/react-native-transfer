package com.hyoper.transfer.helpers;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import com.hyoper.transfer.services.downloader.models.DownloadTask;
import com.hyoper.transfer.services.uploader.models.UploadTask;

import java.util.List;
import java.util.Map;

public class RNTransferConverter {
    public static DownloadTask mapToDownloadTask(ReadableMap map) {
        String id = map.getString("id");
        String url = map.getString("url");
        String path = map.getString("path");
        @Nullable Map<String, ?> headers = getSafeMap(map, "headers");
        @Nullable Map<String, ?> metadata = getSafeMap(map, "metadata");
        return new DownloadTask(id, url, path, headers, metadata);
    }

    public static WritableMap mapFromDownloadTask(DownloadTask task) {
        WritableMap map = createMapFromTask(task.id, task.url, task.path, task.headers, task.metadata);

        map.putString("type", task.type);
        map.putString("status", task.status.name().toLowerCase());
        WritableMap progress = Arguments.createMap();
        progress.putDouble("bytesDownload", task.progress.bytesDownload);
        progress.putDouble("bytesTotal", task.progress.bytesTotal);
        map.putMap("progress", progress);
        return map;
    }

    public static UploadTask mapToUploadTask(ReadableMap map) {
        String id = map.getString("id");
        String url = map.getString("url");
        String path = map.getString("path");
        @Nullable Map<String, ?> headers = getSafeMap(map, "headers");
        @Nullable Map<String, ?> metadata = getSafeMap(map, "metadata");
        return new UploadTask(id, url, path, headers, metadata);
    }

    public static WritableMap mapFromUploadTask(UploadTask task) {
        WritableMap map = createMapFromTask(task.id, task.url, task.path, task.headers, task.metadata);
        map.putString("type", task.type);
        map.putString("status", task.status.name().toLowerCase());
        WritableMap progress = Arguments.createMap();
        progress.putDouble("bytesUpload", task.progress.bytesUpload);
        progress.putDouble("bytesTotal", task.progress.bytesTotal);
        map.putMap("progress", progress);
        return map;
    }

    private static WritableMap createMapFromTask(
            String id,
            String url,
            String path,
            Map<String, ?> headers,
            Map<String, ?> metadata
    ) {
        WritableMap map = Arguments.createMap();

        map.putString("id", id);
        map.putString("url", url);
        map.putString("path", path);

        if (headers != null) map.putMap("headers", toWritableMap(headers));
        else map.putNull("headers");

        if (metadata != null) map.putMap("metadata", toWritableMap(metadata));
        else map.putNull("metadata");

        return map;
    }

    private static Map<String, ?> getSafeMap(ReadableMap source, String key) {
        ReadableMap value = source.getMap(key);
        return value != null ? value.toHashMap() : null;
    }

    @SuppressWarnings("unchecked")
    private static WritableMap toWritableMap(Map<String, ?> source) {
        WritableMap result = Arguments.createMap();

        for (Map.Entry<String, ?> entry : source.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();

            if (value == null) {
                result.putNull(key);
            } else if (value instanceof String) {
                result.putString(key, (String) value);
            } else if (value instanceof Boolean) {
                result.putBoolean(key, (Boolean) value);
            } else if (value instanceof Number) {
                result.putDouble(key, ((Number) value).doubleValue());
            } else if (value instanceof Map) {
                result.putMap(key, toWritableMap((Map<String, ?>) value));
            } else if (value instanceof List) {
                result.putArray(key, toWritableArray((List<?>) value));
            }
        }

        return result;
    }

    @SuppressWarnings("unchecked")
    private static WritableArray toWritableArray(List<?> source) {
        WritableArray result = Arguments.createArray();

        for (Object value : source) {
            if (value == null) {
                result.pushNull();
            } else if (value instanceof String) {
                result.pushString((String) value);
            } else if (value instanceof Boolean) {
                result.pushBoolean((Boolean) value);
            } else if (value instanceof Number) {
                result.pushDouble(((Number) value).doubleValue());
            } else if (value instanceof Map) {
                result.pushMap(toWritableMap((Map<String, ?>) value));
            } else if (value instanceof List) {
                result.pushArray(toWritableArray((List<?>) value));
            }
        }

        return result;
    }
}
