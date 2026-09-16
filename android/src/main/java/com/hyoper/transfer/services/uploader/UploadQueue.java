package com.hyoper.transfer.services.uploader;

import com.hyoper.transfer.services.uploader.models.UploadListener;

import java.util.Map;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

public class UploadQueue {
    private static final int CONCURRENT = 1;
    private final BlockingQueue<Runnable> queue;
    private final ThreadPoolExecutor executor;
    private final Map<String, UploadWorker> workers = new ConcurrentHashMap<>();

    public UploadQueue() {
        queue = new LinkedBlockingQueue<>();
        executor = new ThreadPoolExecutor(CONCURRENT, CONCURRENT, 60L, TimeUnit.SECONDS, queue);
        executor.allowCoreThreadTimeOut(true);
    }

    public void add(UploadTransfer transfer, UploadListener listener) {
        UploadWorker worker = new UploadWorker(transfer, listener, () -> workers.remove(transfer.id));
        workers.put(transfer.id, worker);
        executor.execute(worker);
    }

    public void delete(String id) {
        UploadWorker worker = workers.get(id);
        if (worker != null) {
            worker.cancel();
            workers.remove(id);
            executor.remove(worker);
        }
    }

    public void clear() {
        for (UploadWorker worker : workers.values()) {
            worker.cancel();
        }
        workers.clear();
        executor.shutdownNow();
    }
}
