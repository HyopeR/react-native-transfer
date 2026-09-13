package com.hyoper.transfer.services.downloader;

import com.hyoper.transfer.services.downloader.models.DownloadCallback;

import java.util.Map;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

public class DownloaderQueue {
    private static final int CONCURRENT = 3;
    private final BlockingQueue<Runnable> queue;
    private final ThreadPoolExecutor executor;
    private final Map<String, DownloadWorker> execWorkers = new ConcurrentHashMap<>();

    public DownloaderQueue() {
        queue = new LinkedBlockingQueue<>();
        executor = new ThreadPoolExecutor(CONCURRENT, CONCURRENT, 60L, TimeUnit.SECONDS, queue);
        executor.allowCoreThreadTimeOut(true);
    }

    public void add(DownloadTransfer transfer, DownloadCallback callbacks) {
        DownloadWorker worker = new DownloadWorker(transfer, callbacks, () -> execWorkers.remove(transfer.id));
        execWorkers.put(transfer.id, worker);
        executor.execute(worker);
    }

    public void delete(String id) {
        DownloadWorker worker = execWorkers.remove(id);
        if (worker != null) {
            worker.cancel();
            executor.remove(worker);
        }
    }

    public void reset() {
        for (DownloadWorker worker : execWorkers.values()) {
            worker.cancel();
            executor.remove(worker);
        }
        execWorkers.clear();
        executor.shutdownNow();
    }
}
