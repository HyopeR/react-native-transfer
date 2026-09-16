import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {DownloadNs} from '@hyoper/rn-transfer';

export type TransferCardProps = {
  transfer: DownloadNs.Transfer;
  onStart: () => void;
  onStop: () => void;
  onRemove: () => void;
};

export const TransferCard = ({
  transfer,
  onStart,
  onStop,
  onRemove,
}: TransferCardProps) => {
  const [status, setStatus] = useState<DownloadNs.Status>(transfer.status);
  const [progress, setProgress] = useState<DownloadNs.Progress>(
    transfer.progress,
  );

  const percentage =
    progress.bytesTotal > 0
      ? Math.round((progress.bytesDownload / progress.bytesTotal) * 100)
      : 0;

  useEffect(() => {
    const handleBegin: DownloadNs.EventListener<'begin'> = event => {
      setStatus('working');
      setProgress(prev => ({...prev, bytesTotal: event.bytesExpect}));
    };

    const handleProgress: DownloadNs.EventListener<'progress'> = event => {
      setStatus('working');
      setProgress(prev => ({
        ...prev,
        bytesDownload: event.bytesDownload,
        bytesTotal: event.bytesTotal,
      }));
    };

    const handleDone: DownloadNs.EventListener<'done'> = event => {
      setStatus('done');
      setProgress(prev => ({
        ...prev,
        bytesDownload: event.bytesDownload,
        bytesTotal: event.bytesTotal,
      }));
    };

    const handleFail: DownloadNs.EventListener<'fail'> = event => {
      setStatus('fail');
    };

    transfer
      .on('begin', handleBegin)
      .on('progress', handleProgress)
      .on('done', handleDone)
      .on('fail', handleFail);
  }, [transfer]);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.columnLeft}>
          <Text style={styles.textLabel}>ID:</Text>
        </View>
        <View style={styles.columnRight}>
          <Text>{transfer.id}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.columnLeft}>
          <Text style={styles.textLabel}>URL:</Text>
        </View>
        <View style={styles.columnRight}>
          <Text
            style={styles.textSmall}
            numberOfLines={2}
            ellipsizeMode={'tail'}>
            {transfer.url}
          </Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.columnLeft}>
          <Text style={styles.textLabel}>PATH:</Text>
        </View>
        <View style={styles.columnRight}>
          <Text
            style={styles.textSmall}
            numberOfLines={2}
            ellipsizeMode={'tail'}>
            {transfer.path}
            {transfer.path}
            {transfer.path}
          </Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.columnLeft}>
          <Text style={styles.textLabel}>STATUS:</Text>
        </View>
        <View style={styles.columnRight}>
          <Text>{status}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.columnLeft}>
          <Text style={styles.textLabel}>PROGRESS:</Text>
        </View>
        <View style={styles.columnRight}>
          <Text>{percentage}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          disabled={status !== 'idle'}
          style={{
            ...styles.button,
            backgroundColor: status === 'idle' ? 'green' : 'gray',
            opacity: status === 'idle' ? 1 : 0.5,
          }}
          onPress={onStart}>
          <Text>Download</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={status !== 'working'}
          style={{
            ...styles.button,
            backgroundColor: status === 'working' ? 'orange' : 'gray',
            opacity: status === 'working' ? 1 : 0.5,
          }}
          onPress={onStop}>
          <Text>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={status !== 'fail'}
          style={{
            ...styles.button,
            backgroundColor: status === 'fail' ? 'blue' : 'gray',
            opacity: status === 'fail' ? 1 : 0.5,
          }}
          onPress={onStart}>
          <Text>Retry</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{...styles.button, backgroundColor: 'red'}}
          onPress={onRemove}>
          <Text>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 232,
    backgroundColor: '#DDD',
    padding: 8,
  },
  row: {
    height: 36,
    flexDirection: 'row',
    columnGap: 8,
  },
  columnLeft: {
    width: 80,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  columnRight: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textLabel: {
    fontWeight: '700',
  },
  textSmall: {
    fontSize: 11,
  },
});
