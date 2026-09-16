package com.hyoper.transfer.services.uploader;

import androidx.annotation.Nullable;

import com.hyoper.transfer.services.uploader.models.UploadListener;
import com.hyoper.transfer.utils.FileUtils;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;
import java.util.concurrent.CountDownLatch;

public class UploadWorker implements Runnable {
    private final UploadTransfer transfer;
    private final UploadListener listener;
    private final Runnable clean;
    private HttpURLConnection connection;
    private volatile boolean isThreadCancel = false;
    private volatile Thread thread;
    private final CountDownLatch threadWait = new CountDownLatch(1);

    public UploadWorker(UploadTransfer transfer, UploadListener listener, Runnable clean) {
        this.transfer = transfer;
        this.listener = listener;
        this.clean = clean;
    }

    @Override
    public void run() {
        File file = new File(transfer.path);
        try {
            this.thread = Thread.currentThread();

            if (!FileUtils.checkFile(file)) {
                throw new IOException("File does not exist: " + transfer.path);
            }

            long bytesTotal = file.length();
            if (bytesTotal < 0) {
                bytesTotal = 0;
            }

            this.connection = this.createConnection(this.transfer.url, this.transfer.headers);
            this.connection.setFixedLengthStreamingMode(bytesTotal);
            this.connection.connect();

            this.transfer.setStatus("working");
            this.transfer.setProgress(0, bytesTotal);
            this.listener.onBegin(this.transfer.id, bytesTotal);

            try (FileInputStream input = new FileInputStream(file);
                 OutputStream output = this.connection.getOutputStream()) {

                byte[] data = new byte[4096];
                long bytesUpload = 0;
                int count;

                long lastEmitTime = 0;
                while ((count = input.read(data)) != -1) {
                    bytesUpload += count;
                    output.write(data, 0, count);

                    long now = System.currentTimeMillis();
                    if (now - lastEmitTime > 250) {
                        if (!this.isThreadCancel) {
                            lastEmitTime = now;
                            this.transfer.setProgress(bytesUpload, bytesTotal);
                            this.listener.onProgress(this.transfer.id, bytesUpload, bytesTotal);
                        }
                    }
                }
            }

            int code = this.connection.getResponseCode();
            if (code < HttpURLConnection.HTTP_OK || code >= HttpURLConnection.HTTP_MULT_CHOICE) {
                throw new IOException("HTTP error code: " + code);
            }

            this.transfer.setStatus("done");
            this.transfer.setProgress(bytesTotal, bytesTotal);
            this.listener.onDone(this.transfer.id, bytesTotal, bytesTotal);
        } catch (Exception e) {
            this.transfer.setStatus("fail");
            this.listener.onFail(this.transfer.id, e);
        } finally {
            closeConnection(this.connection);
            clean.run();
            this.threadWait.countDown();
        }
    }

    public void cancel() {
        this.isThreadCancel = true;

        if (this.thread == null) return;

        this.thread.interrupt();

        closeConnection(this.connection);

        try {
            this.threadWait.await();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    private HttpURLConnection createConnection(String url, @Nullable Map<String, ?> headers) throws IOException {
        URL connectionUrl = new URL(url);
        HttpURLConnection connection = (HttpURLConnection) connectionUrl.openConnection();
        connection.setConnectTimeout(30_000);
        connection.setReadTimeout(30_000);
        connection.setInstanceFollowRedirects(true);
        connection.setDoOutput(true);
        connection.setRequestMethod("POST");

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
}