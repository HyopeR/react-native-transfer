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
      <View style={styles.cardRow}>
        <View style={{...styles.cardColumn, flex: 0}}>
          <Text>ID:</Text>
        </View>
        <View style={styles.cardColumn}>
          <Text>{transfer.id}</Text>
        </View>
      </View>

      <View style={styles.cardRow}>
        <View style={{...styles.cardColumn, flex: 0}}>
          <Text>URL:</Text>
        </View>
        <View style={styles.cardColumn}>
          <Text>{transfer.url}</Text>
        </View>
      </View>

      <View style={styles.cardRow}>
        <View style={{...styles.cardColumn, flex: 0}}>
          <Text>PATH:</Text>
        </View>
        <View style={styles.cardColumn}>
          <Text>{transfer.path}</Text>
        </View>
      </View>

      <View style={styles.cardRow}>
        <View style={{...styles.cardColumn, flex: 0}}>
          <Text>STATUS:</Text>
        </View>
        <View style={styles.cardColumn}>
          <Text>{status}</Text>
        </View>
      </View>

      <View style={styles.cardRow}>
        <View style={{...styles.cardColumn, flex: 0}}>
          <Text>PROGRESS:</Text>
        </View>
        <View style={styles.cardColumn}>
          <Text>{percentage}</Text>
        </View>
      </View>

      <View style={styles.cardRow}>
        <TouchableOpacity
          disabled={status !== 'idle'}
          style={{
            ...styles.cardButton,
            backgroundColor: status === 'idle' ? 'green' : 'gray',
            opacity: status === 'idle' ? 1 : 0.5,
          }}
          onPress={onStart}>
          <Text>Download</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={status !== 'working'}
          style={{
            ...styles.cardButton,
            backgroundColor: status === 'working' ? 'orange' : 'gray',
            opacity: status === 'working' ? 1 : 0.5,
          }}
          onPress={onStop}>
          <Text>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{...styles.cardButton, backgroundColor: 'red'}}
          onPress={onRemove}>
          <Text>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 216,
    backgroundColor: '#EEE',
  },
  cardRow: {
    height: 36,
    flexDirection: 'row',
    columnGap: 8,
  },
  cardColumn: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  cardButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
