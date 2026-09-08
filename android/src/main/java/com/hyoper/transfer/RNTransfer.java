package com.hyoper.transfer;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
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
}
