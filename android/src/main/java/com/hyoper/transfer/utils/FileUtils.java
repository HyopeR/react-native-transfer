package com.hyoper.transfer.utils;

import java.io.File;

public class FileUtils {
    public static void createParentDirectory(File file) {
        File parent = file.getParentFile();
        if (parent != null && !parent.exists()) {
            parent.mkdirs();
        }
    }

    public static void cleanFile(File file) {
        if (file.exists()) {
            file.delete();
        }
    }
}
