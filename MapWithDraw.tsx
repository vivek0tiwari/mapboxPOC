import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
const {points, polygon, lineString} = require('@turf/helpers');
import turfcenter from '@turf/center';

const stateVal = {
  backgroundColor: 'blue',
  coordinates: [
    [77.1025, 28.7061],
    [77.1035, 28.7081],
    [77.1055, 28.7091],
    [77.1045, 28.7061],
    [77.1035, 28.7071],
  ],
};

const AnnotationContent = ({onPress}) => {
  return (
    <View style={styles.touchableContainer}>
      <TouchableOpacity
        style={styles.touchable}
        onPress={onPress}></TouchableOpacity>
    </View>
  );
};

AnnotationContent.propTypes = {};

const MapWithDraw = ({navigation, route}) => {
  const [centerCoords, setCenterCoords] = useState<number[]>([]);
  const map = useRef<any>();
  const [drawPolygon, setDrawPolygon] = useState<number[][]>([]);
  const [polygonCoords, setPolygonCoords] = useState<any>(null);

  const draw = (coords: number[]) => {
    let newDraw = [...drawPolygon];
    console.log(newDraw.length);

    if (drawPolygon.length > 0) {
      if (drawPolygon.length >= 4) {
        let polygonVal;
        newDraw.push(coords);
        polygonVal = lineString([...newDraw, newDraw[0]]);
        console.log(polygonVal);
        setPolygonCoords(polygonVal);
        setDrawPolygon(newDraw);
      } else {
        let drawLength = newDraw.push(coords);
        let diff = 4 - drawLength;
        let polygonVal;
        switch (diff) {
          case 0:
            polygonVal = lineString([...newDraw, newDraw[0]]);
            console.log(polygonVal);
            setPolygonCoords(polygonVal);
            setDrawPolygon(newDraw);

            break;

          case 1:
            polygonVal = lineString([...newDraw, newDraw[0]]);
            console.log(polygonVal);
            setPolygonCoords(polygonVal);
            setDrawPolygon(newDraw);

            break;

          case 2:
            polygonVal = lineString([...newDraw, coords, newDraw[0]]);
            console.log(polygonVal);
            setPolygonCoords(polygonVal);
            setDrawPolygon(newDraw);
            break;
        }
      }
    } else {
      newDraw.push(coords);
      let polygonVal = lineString([coords, coords, coords, coords]);
      console.log(polygonVal);
      setPolygonCoords(polygonVal);
      setDrawPolygon(newDraw);
    }
  };

  const removeDraw = () => {
    setDrawPolygon([]);
    setPolygonCoords(null);
  };

  useEffect(() => {
    let centCord = turfcenter(points(stateVal.coordinates));
    console.log('center');
    console.log(centCord.geometry.coordinates);
    setCenterCoords(centCord.geometry.coordinates);
  }, []);

  return (
    <View style={styles.page}>
      {/* Render Map With order selected codinates */}

      <View style={styles.container}>
        <MapboxGL.MapView
          style={styles.map}
          onPress={feature => {
            console.log(feature.geometry.coordinates);
            draw(feature.geometry.coordinates);
          }}
          logoEnabled={false}
          ref={map}>
          {centerCoords.length > 0 ? (
            <MapboxGL.Camera
              zoomLevel={15}
              centerCoordinate={centerCoords}
              animationDuration={5000}
            />
          ) : null}

          {drawPolygon.length !== 0
            ? drawPolygon.map((item, index) => {
                return (
                  <MapboxGL.MarkerView
                    coordinate={item}
                    id={`marker-${index}`}
                    key={`marker-${index}`}>
                    <AnnotationContent
                      onPress={() => {
                        console.log(index + 1);
                      }}
                    />
                  </MapboxGL.MarkerView>
                );
              })
            : null}

          {polygonCoords !== null ? (
            <MapboxGL.ShapeSource id={'area1x'} shape={polygonCoords}>
              <MapboxGL.LineLayer
                id={'linelayer1x'}
                style={{lineColor: 'blue', lineOpacity: 1, lineWidth: 5}}
              />
            </MapboxGL.ShapeSource>
          ) : null}
        </MapboxGL.MapView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  container: {
    width: '100%',
    height: '70%',
  },
  map: {
    flex: 1,
  },
  touchableContainer: {width: 'auto', height: 'auto'},
  touchable: {
    width: 10,
    height: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
  },
  touchableText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MapWithDraw;
