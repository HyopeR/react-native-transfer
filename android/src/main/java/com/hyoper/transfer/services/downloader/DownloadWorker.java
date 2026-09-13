package com.hyoper.transfer.services.downloader;

import com.hyoper.transfer.services.downloader.models.DownloadCallback;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;

public class DownloadWorker implements Runnable {
    private final DownloadTransfer transfer;
    private final DownloadCallback callbacks;
    private final Runnable complete;
    private HttpURLConnection connection;
    private volatile boolean cancelled = false;

    public DownloadWorker(DownloadTransfer transfer, DownloadCallback callbacks, Runnable complete) {
        this.transfer = transfer;
        this.callbacks = callbacks;
        this.complete = complete;
    }

    @Override
    public void run() {
        File outputFile = new File(transfer.path);

        try {
            URL url = new URL(transfer.url);
            connection = (HttpURLConnection) url.openConnection();

            if (transfer.headers != null) {
                for (Map.Entry<String, ?> entry : transfer.headers.entrySet()) {
                    connection.setRequestProperty(entry.getKey(), String.valueOf(entry.getValue()));
                }
            }

            connection.connect();

            long bytesTotal = connection.getContentLength();
            transfer.setStatus("working");
            transfer.setProgress(0, bytesTotal);
            callbacks.onBegin(transfer.id, bytesTotal);

            ensureParentDirectory(outputFile);

            if (cancelled) return;

            try (InputStream input = connection.getInputStream();
                 FileOutputStream output = new FileOutputStream(outputFile)) {

                byte[] data = new byte[4096];
                long bytesDownload = 0;
                int count;

                long lastEmitTime = 0;
                while (!cancelled && (count = input.read(data)) != -1) {
                    bytesDownload += count;
                    output.write(data, 0, count);

                    long now = System.currentTimeMillis();
                    if (now - lastEmitTime > 150) {
                        lastEmitTime = now;
                        transfer.setProgress(bytesDownload, bytesTotal);
                        callbacks.onProgress(transfer.id, bytesDownload, bytesTotal);
                    }
                }
            }

            if (cancelled) {
                cleanupFile(outputFile);
                return;
            }

            transfer.setStatus("done");
            transfer.setProgress(bytesTotal, bytesTotal);
            callbacks.onDone(transfer.id, bytesTotal, bytesTotal);

        } catch (Exception e) {
            cleanupFile(outputFile);
            transfer.setStatus("fail");
            callbacks.onFail(transfer.id, e);
        } finally {
            closeConnection();
            if (complete != null) {
                complete.run();
            }
        }
    }

    public void cancel() {
        cancelled = true;
        closeConnection();
    }

    private void closeConnection() {
        if (connection != null) {
            try {
                connection.disconnect();
            } catch (Exception ignored) {
            }
        }
    }

    private void ensureParentDirectory(File file) {
        File parent = file.getParentFile();
        if (parent != null && !parent.exists()) {
            parent.mkdirs();
        }
    }

    private void cleanupFile(File file) {
        if (file.exists()) {
            file.delete();
        }
    }
}