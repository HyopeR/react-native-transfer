package com.hyoper.transfer.services.downloader;

import androidx.annotation.Nullable;

import com.hyoper.transfer.services.downloader.models.DownloadListener;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;

public class DownloadWorker implements Runnable {
    private final DownloadTransfer transfer;
    private final DownloadListener listener;
    private final Runnable clean;
    private volatile HttpURLConnection connection;
    private volatile Thread thread;
    private volatile boolean threadCancelled = false;

    public DownloadWorker(DownloadTransfer transfer, DownloadListener listener, Runnable clean) {
        this.transfer = transfer;
        this.listener = listener;
        this.clean = clean;
    }

    @Override
    public void run() {
        File file = new File(transfer.path);

        try {
            this.thread = Thread.currentThread();
            this.connection = this.createConnection(this.transfer.url, this.transfer.headers);
            this.connection.connect();

            int code = this.connection.getResponseCode();
            if (code != HttpURLConnection.HTTP_OK && code != HttpURLConnection.HTTP_PARTIAL) {
                throw new IOException("HTTP error code: " + code);
            }

            long bytesTotal = this.connection.getContentLengthLong();
            if (bytesTotal <= 0) {
                throw new IOException("HTTP Content-Length unavailable.");
            }
            this.transfer.setStatus("working");
            this.transfer.setProgress(0, bytesTotal);
            this.listener.onBegin(this.transfer.id, bytesTotal);

            createParentDirectory(file);

            try (InputStream input = this.connection.getInputStream();
                 FileOutputStream output = new FileOutputStream(file)) {

                byte[] data = new byte[4096];
                long bytesDownload = 0;
                int count;

                long lastEmitTime = 0;
                while ((count = input.read(data)) != -1) {
                    bytesDownload += count;
                    output.write(data, 0, count);

                    long now = System.currentTimeMillis();
                    if (now - lastEmitTime > 150) {
                        lastEmitTime = now;
                        this.transfer.setProgress(bytesDownload, bytesTotal);
                        this.listener.onProgress(this.transfer.id, bytesDownload, bytesTotal);
                    }
                }
            }

            this.transfer.setStatus("done");
            this.transfer.setProgress(bytesTotal, bytesTotal);
            this.listener.onDone(this.transfer.id, bytesTotal, bytesTotal);
        } catch (Exception e) {
            this.transfer.setStatus("fail");
            this.listener.onFail(this.transfer.id, e);
            cleanFile(file);
        } finally {
            closeConnection(this.connection);
            clean.run();
        }
    }

    public void cancel() {
        this.threadCancelled = true;

        if (this.thread != null) {
            this.thread.interrupt();
        }
    }

    private HttpURLConnection createConnection(String url, @Nullable Map<String, ?> headers) throws IOException {
        URL connectionUrl = new URL(url);
        HttpURLConnection connection = (HttpURLConnection) connectionUrl.openConnection();
        connection.setConnectTimeout(30_000);
        connection.setReadTimeout(30_000);
        connection.setInstanceFollowRedirects(true);

        if (headers != null) {
            for (Map.Entry<String, ?> entry : headers.entrySet()) {
                connection.setRequestProperty(entry.getKey(), String.valueOf(entry.getValue()));
            }
        }

        return connection;
    }

    private void closeConnection(@Nullable HttpURLConnection connection) {
        if (connection != null) {
            try {
                connection.disconnect();
            } catch (Exception ignored) {
                // ignore.
            }
        }
    }

    private void createParentDirectory(File file) {
        File parent = file.getParentFile();
        if (parent != null && !parent.exists()) {
            parent.mkdirs();
        }
    }

    private void cleanFile(File file) {
        if (file.exists()) {
            file.delete();
        }
    }
}