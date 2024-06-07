import {downloadRoute} from './common/downloadManager';
import React from 'react';
import {useState} from 'react';
import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import * as Progress from 'react-native-progress';
import MapboxGL from '@rnmapbox/maps';

export const Downloader = () => {
  const [isDownloaded, setDownloaded] = useState<boolean>(false);
  const onProgress = (pack, status) => {
    console.log('progress', status, pack);
  };
  const onDownloadError = (pack, status) => {};
  const onDownloadClick = () => {
    const isDownloaded = downloadRoute({
      name: 'england',
      onProgress,
      onError: onDownloadError,
    });
  };
  const onDeleteClick = async () => {
    await MapboxGL.offlineManager.deletePack('england');
    await MapboxGL.offlineManager.resetDatabase();
  };
  const onGetAl = async () => {
    const packs = await MapboxGL.offlineManager.getPacks();
    console.log('=> packs:', packs);
    packs.forEach(pack => {
      console.log(
        'pack:',
        pack,
        'name:',
        pack.name,
        'bounds:',
        pack?.bounds,
        'metadata',
        pack?.metadata,
      );
    });
  };
  return (
    <View style={styles.container}>
      <Progress.Bar progress={0.3} width={200} />
      <TouchableOpacity style={styles.button} onPress={onDownloadClick}>
        <Text>Download Pack</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onDeleteClick}>
        <Text>Delete Pack</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onGetAl}>
        <Text>Get All Pack</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    marginHorizontal: 16,
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#cab0e8',
    padding: 10,
    margin: 10,
  },
  title: {
    textAlign: 'center',
    marginVertical: 8,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
