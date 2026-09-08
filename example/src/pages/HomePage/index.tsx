import React from 'react';
import {Text, View} from 'react-native';
import {Screen} from '../../commons/Screen';
import {PageStyle} from '../styles';
import {PageProps} from '../types';

export const HomePage = ({children}: PageProps) => {
  return (
    <Screen>
      <Screen.Header>
        <Screen.Title>React Native Transfer</Screen.Title>
        <Screen.Subtitle>@hyoper/rn-transfer</Screen.Subtitle>
      </Screen.Header>

      <Screen.Content style={PageStyle.root}>
        <View style={PageStyle.body}>
          <Text style={PageStyle.description}>
            A high-performance react-native library for downloads and uploads.
          </Text>

          {children}
        </View>
      </Screen.Content>
    </Screen>
  );
};
