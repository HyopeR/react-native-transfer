package com.hyoper.transfer.services.downloader;

import com.hyoper.transfer.services.downloader.models.DownloadListener;

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

    public void add(DownloadTransfer transfer, DownloadListener callbacks) {
        DownloadWorker worker = new DownloadWorker(transfer, callbacks, () -> execWorkers.remove(transfer.id));
        execWorkers.put(transfer.id, worker);
        executor.execute(worker);
    }

    public void delete(String id) {
        DownloadWorker worker = execWorkers.get(id);
        if (worker != null) {
            worker.cancel();
            execWorkers.remove(id);
            executor.remove(worker);
        }
    }

    public void clear() {
        for (DownloadWorker worker : execWorkers.values()) {
            worker.cancel();
        }
        execWorkers.clear();
        executor.shutdownNow();
    }
}
