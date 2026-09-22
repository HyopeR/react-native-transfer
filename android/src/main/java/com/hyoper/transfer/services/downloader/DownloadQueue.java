package com.hyoper.transfer.services.downloader;

import com.hyoper.transfer.services.downloader.models.DownloadListener;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

public class DownloadQueue {
    private static final int CONCURRENT = 3;
    private final BlockingQueue<Runnable> queue;
    private final ThreadPoolExecutor executor;
    private final Map<String, DownloadWorker> workers = new ConcurrentHashMap<>();

    public DownloadQueue() {
        queue = new LinkedBlockingQueue<>();
        executor = new ThreadPoolExecutor(CONCURRENT, CONCURRENT, 60L, TimeUnit.SECONDS, queue);
        executor.allowCoreThreadTimeOut(true);
    }

    public void add(DownloadTransfer transfer, DownloadListener listener) {
        DownloadWorker worker = new DownloadWorker(transfer, listener, () -> workers.remove(transfer.id));
        workers.put(transfer.id, worker);
        executor.execute(worker);
    }

    public void delete(String id) {
        DownloadWorker worker = workers.get(id);
        if (worker != null) {
            worker.cancel();
            executor.remove(worker);
        }
    }

    public void clear() {
        List<DownloadWorker> workerList = new ArrayList<>(workers.values());
        workers.clear();
        for (DownloadWorker worker : workerList) {
            worker.cancel();
        }
        executor.shutdownNow();
    }
}
