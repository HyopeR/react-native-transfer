import React from 'react';
import {Text, View} from 'react-native';
import {Screen} from '../../commons/Screen';
import {PageStyle} from '../styles';
import {PageProps} from '../types';

export const UploadPage = ({back}: PageProps) => {
  return (
    <Screen>
      <Screen.Header left={'Back'} leftProps={{onPress: back}}>
        <Screen.Title>Upload</Screen.Title>
      </Screen.Header>

      <Screen.Content style={PageStyle.root}>
        <View style={PageStyle.body}>
          <Text style={PageStyle.description}>Description here.</Text>
        </View>
      </Screen.Content>
    </Screen>
  );
};
