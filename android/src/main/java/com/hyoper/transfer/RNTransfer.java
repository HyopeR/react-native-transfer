package com.hyoper.transfer;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;

import com.hyoper.transfer.helpers.RNTransferUtils;

@ReactModule(name = RNTransfer.NAME)
public class RNTransfer extends NativeRNTransferSpec {
    public static final String NAME = "RNTransfer";

    public RNTransfer(ReactApplicationContext reactContext) {
        super(reactContext);
        RNTransferUtils.setName(NAME);
    }

    @Override
    public void invalidate() {
        RNTransferUtils.reset();
    }

    @NonNull
    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public WritableArray getDownloads() {
        return null;
    }

    @Override
    public boolean clearDownloads() {
        return false;
    }

    @Nullable
    @Override
    public WritableMap getDownload(String id) {
        return null;
    }

    @Override
    public WritableMap createDownload(ReadableMap options) {
        return null;
    }

    @Override
    public WritableMap removeDownload(String id) {
        return null;
    }

    @Override
    public void startDownload(String id) {

    }

    @Override
    public void stopDownload(String id) {

    }

    @Override
    public WritableArray getUploads() {
        return null;
    }

    @Override
    public boolean clearUploads() {
        return false;
    }

    @Nullable
    @Override
    public WritableMap getUpload(String id) {
        return null;
    }

    @Override
    public WritableMap createUpload(ReadableMap options) {
        return null;
    }

    @Override
    public WritableMap removeUpload(String id) {
        return null;
    }

    @Override
    public void startUpload(String id) {

    }

    @Override
    public void stopUpload(String id) {

    }
}
