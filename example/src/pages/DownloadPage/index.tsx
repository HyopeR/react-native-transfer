import React, {useEffect, useRef, useState} from 'react';
import {FlatList, Text, View} from 'react-native';
import {
  RNTransfer,
  DownloadTransfer,
  DownloadSubscription,
} from '@hyoper/rn-transfer';
import {Button, Screen} from '../../components/commons';
import {TransferCard} from '../../components/specifics';
import {PageStyle} from '../styles';
import {PageProps} from '../types';

export const DownloadPage = ({back}: PageProps) => {
  const [urls] = useState<{name: string; url: string}[]>([
    {name: '1mb', url: 'https://proof.ovh.net/files/1Mb.dat'},
    {name: '10mb', url: 'https://proof.ovh.net/files/10Mb.dat'},
    {name: '100mb', url: 'https://proof.ovh.net/files/100Mb.dat'},
  ]);

  const [transferMap, setTransferMap] = useState<
    Record<string, DownloadTransfer>
  >({});

  const subscriptionMap = useRef<Map<string, DownloadSubscription>>(new Map());

  useEffect(() => {
    const transfers = RNTransfer.getDownloads();
    const transfersToMap = transfers.reduce((previous, transfer) => {
      return {...previous, [transfer.id]: transfer};
    }, {});
    setTransferMap(transfersToMap);
  }, []);

  const createTransfer = (url: string) => {
    const id = RNTransfer.uuid();
    const path = RNTransfer.directories.app.concat(`/${id}.dat`);
    const transfer = RNTransfer.createDownload({id, url, path});
    setTransferMap(prev => ({...prev, [id]: transfer}));
  };

  const removeTransfer = async (id: string) => {
    const transfer = transferMap[id];
    if (transfer) {
      await transfer.remove();
      setTransferMap(prev => {
        const {[id]: _, ...rest} = prev;
        return rest;
      });
      subscriptionMap.current.delete(transfer.id);
    }
  };

  const startTransfer = (transfer: DownloadTransfer) => {
    const subscription = transfer.subscribe({
      begin: event => console.log(event),
      progress: event => console.log(event),
      done: event => console.log(event),
      fail: event => console.log(event),
    });
    subscriptionMap.current.set(transfer.id, subscription);
    transfer.start();
  };

  const stopTransfer = async (transfer: DownloadTransfer) => {
    transfer.stop();
    const subscription = subscriptionMap.current.get(transfer.id);
    if (subscription) {
      subscription.unsubscribe();
      subscriptionMap.current.delete(transfer.id);
    }
  };

  return (
    <Screen>
      <Screen.Header left={'Back'} leftProps={{onPress: back}}>
        <Screen.Title>Download</Screen.Title>
      </Screen.Header>

      <Screen.Content style={PageStyle.root}>
        <View style={PageStyle.body}>
          <View>
            <Text style={PageStyle.description}>
              In this example, you can see how downloads are managed. Use the
              buttons to control it.
            </Text>
          </View>

          <View style={PageStyle.buttons}>
            {urls.map(({name, url}) => {
              return (
                <Button
                  key={name}
                  title={name}
                  style={PageStyle.button}
                  onPress={() => createTransfer(url)}
                />
              );
            })}
          </View>

          <FlatList
            data={Object.values(transferMap)}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <TransferCard
                transfer={item}
                onStart={() => startTransfer(item)}
                onStop={() => stopTransfer(item)}
                onRemove={() => removeTransfer(item.id)}
              />
            )}
            ItemSeparatorComponent={() => <View style={{height: 8}} />}
            style={{flex: 1, flexGrow: 1}}
            contentContainerStyle={{flexGrow: 1}}
          />
        </View>
      </Screen.Content>
    </Screen>
  );
};
