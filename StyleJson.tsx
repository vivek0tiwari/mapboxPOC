import React, {useCallback, useRef, useState} from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import MapboxGL, {MapView, Camera} from '@rnmapbox/maps';

import type {FeatureCollection, Position, Geometry} from 'geojson';
import {centerCoordinate, defaultCords, habitats} from './data';
import {OnPressEvent} from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  POLYGON_EMPTY_LAYER,
  POLYGON_FOCUSED_LAYER,
  POLYGON_LAYER,
  allData,
  centroidAidash,
} from './mapUtils';

const getgeoJson = (cords: Position[][]) => {
  const geojson: FeatureCollection = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          c: '',
          stroke: '#555555',
          'stroke-width': 2,
          'stroke-opacity': 1,
          fill: '#ffffff',
          'fill-opacity': 0.5,
        },
        geometry: {
          type: 'Polygon',
          coordinates: cords || defaultCords,
        },
      },
    ],
  };
  return geojson;
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  zoomButtonStyle: {},
});

const StyleJson = () => {
  const [zoomLevel, setZoomLevel] = useState<number>(17);
  const [isDownloadingMap, setIsDownloadingMap] = useState<Boolean>(false);
  const [selectedFeatures, setSelectedFeatures] = useState<String[]>([]);
  const mapRef = useRef<MapView>(null);
  const polygonLayers = [POLYGON_LAYER];
  const dynamicSources = [
    {
      source: allData,
      layers: polygonLayers,
    },
  ];

  console.log('geoJson Data', allData);

  const onPlusePress = useCallback(() => {
    setZoomLevel(zoomLevel => zoomLevel + 1);
  }, [setZoomLevel]);
  const onMinusPress = useCallback(() => {
    setZoomLevel(zoomLevel => zoomLevel - 1);
  }, [setZoomLevel]);

  const onLayerClick = async (event: OnPressEvent) => {
    const bbox: BBox = [
      [event.point.x - 5, event.point.y - 5],
      [event.point.x + 5, event.point.y + 5],
    ];
    // Find features intersecting the bounding box.
    const _selectedFeatures =
      await mapRef?.current?.queryRenderedFeaturesInRect(bbox, {
        layers: ['shape1'],
      });
    const fips = _selectedFeatures?.features.map(
      feature => feature?.properties?.id,
    );
    // Set a filter matching selected features by FIPS codes
    // to activate the 'counties-highlighted' layer.
    // setSelectedFeatures(fips);
    console.log('onLayerClick', fips, JSON.stringify(event));
    setSelectedFeatures([event?.features[0]?.id]);
    // console.log('onLayerClick', event.features[0].id);
  };

  return (
    <>
      <MapView style={styles.map} zoomEnabled scrollEnabled>
        <Camera
          defaultSettings={{
            centerCoordinate: centroidAidash,
            zoomLevel: zoomLevel,
          }}
          zoomLevel={zoomLevel}
        />

        {dynamicSources.map(dynamicSource => (
          <MapboxGL.ShapeSource
            onPress={onLayerClick}
            shape={dynamicSource.source}
            key={dynamicSource.source.id}
            id={dynamicSource.source.id}>
            {dynamicSource.layers.map(layer => (
              <MapboxGL.FillLayer
                sourceLayerID={dynamicSource.source.id}
                sourceID={dynamicSource.source.id}
                {...layer}
                key={`${dynamicSource.source.id}-${layer.id}`}
                id={`${dynamicSource.source.id}-${layer.id}`}
              />
            ))}
          </MapboxGL.ShapeSource>
        ))}
        {/* <MapboxGL.ShapeSource shape={allData} id={'shape1'}>
          <MapboxGL.FillLayer
            id={'ddd'}
            style={{
              fillColor: 'red',
            }}
          />
        </MapboxGL.ShapeSource> */}
        {/* <MapboxGL.ShapeSource
          id={'baseShape'}
          shape={{
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Polygon',
                  coordinates: defaultCords,
                },
              },
            ],
          }}>
          <MapboxGL.FillLayer id="f1" style={{fillColor: 'grey'}} />
        </MapboxGL.ShapeSource>
        <MapboxGL.ShapeSource
          onPress={onLayerClick}
          id={'shape1'}
          shape={{
            type: 'FeatureCollection',
            features: habitats.map(habitat => ({
              type: 'Feature',
              id: habitat.id,
              properties: {
                stroke: '#000000',
                strokeWidth: 7,
                content: {
                  planHabitatId: habitat.id,
                },
              },
              geometry: habitat.geometry as Geometry,
            })),
          }}>
          <MapboxGL.FillLayer
            id={'sss'}
            style={{
              fillColor: 'red',
            }}
            // filter={['in', 'id', ...selectedFeatures]}
          />
        </MapboxGL.ShapeSource> */}

        {/* <Style
            json={
              this.state.showAltStyle ? StyleJsonExample2 : StyleJsonExample
            }
          /> */}
      </MapView>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 12,
        }}>
        <TouchableOpacity onPress={onPlusePress}>
          <Icon name="plus" size={28} color="#900" />
        </TouchableOpacity>

        <TouchableOpacity onPress={onMinusPress}>
          <Icon name="minus" size={28} color="#900" />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default StyleJson;

/* end-example-doc */

/** @type ExampleWithMetadata['metadata'] */
const metadata = {
  title: 'Style JSON',
  tags: ['Style#json'],
  docs: `
Change style of a MapView on the fly.
`,
};
StyleJson.metadata = metadata;
