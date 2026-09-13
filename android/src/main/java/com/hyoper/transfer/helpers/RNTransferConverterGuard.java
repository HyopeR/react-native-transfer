package com.hyoper.transfer.helpers;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import com.hyoper.transfer.services.downloader.DownloadTransfer;
import com.hyoper.transfer.services.uploader.UploadTransfer;

public class RNTransferConverterGuard {
    public static void ensureMapTo(ReadableMap map) throws IllegalArgumentException {
        if (!map.hasKey("id") || map.getType("id") != ReadableType.String) {
            throw new IllegalArgumentException("options.id is required.");
        }

        if (!map.hasKey("url") || map.getType("url") != ReadableType.String) {
            throw new IllegalArgumentException("options.url is required.");
        }

        if (!map.hasKey("path") || map.getType("path") != ReadableType.String) {
            throw new IllegalArgumentException("options.path is required.");
        }

        if (map.hasKey("headers") && !map.isNull("headers") && map.getType("headers") != ReadableType.Map) {
            throw new IllegalArgumentException("options.headers must be object.");
        }

        if (map.hasKey("metadata") && !map.isNull("metadata") && map.getType("metadata") != ReadableType.Map) {
            throw new IllegalArgumentException("options.metadata must be object.");
        }
    }

    public static void ensureMapFrom(@Nullable DownloadTransfer transfer) {
        if (transfer == null) {
            throw new IllegalArgumentException("Transfer not found.");
        }
    }

    public static void ensureMapFrom(@Nullable UploadTransfer transfer) {
        if (transfer == null) {
            throw new IllegalArgumentException("Transfer not found.");
        }
    }
}
