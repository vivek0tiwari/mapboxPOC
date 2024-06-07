/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import MapboxGL from '@rnmapbox/maps';
import {Dimensions} from 'react-native';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import StyleJson from './StyleJson';
import OfflineExample from './CreateOfflineRegion';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Downloader} from './Downloader';
import CreateOfflineRegion from './CreateOfflineRegion';
import MapWithDraw from './MapWithDraw';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const Tab = createBottomTabNavigator();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  MapboxGL.setAccessToken(
    'sk.eyJ1IjoiYWlkYXNoLWl2bXMiLCJhIjoiY2t0czdqZHF2MDlnejJubzN4bWNtYzZlNSJ9.1-p0jStVtYZGJBERkmzyRA',
  );

  useEffect(() => {
    MapboxGL.setTelemetryEnabled(false);
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Map" component={StyleJson} />
        <Tab.Screen name="Downloader" component={Downloader} />
        <Tab.Screen name="Offline" component={CreateOfflineRegion} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    height: screenHeight - 40,
    width: screenWidth - 10,
  },
  map: {
    flex: 1,
  },
});

export default App;
