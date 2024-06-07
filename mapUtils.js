import {
  featureCollection as turfCreateFeatureCollection,
  feature as turfCreateFeature,
  multiPolygon as turfCreateMultiPolygon,
  intersect as turfIntersect,
  area,
  Polygon,
} from '@turf/turf';
import jsonData from './aidash-site.json';
import {aidashPolygonPropertiesMap} from './aiDashHabitatColorMaps';

export const BASE_POLYGON_HABITAT_SOURCE = {
  id: 'base-polygon-habitat-source',
  type: 'geojson',
  promoteId: 'id',
  data: {
    type: 'FeatureCollection',
    features: [],
  },
};
export const POLYGON_EMPTY_LAYER = {
  id: 'polygon-empty-layer',
  type: 'fill',
  paint: {
    'fill-color': '#272727',
  },
  filter: ['all', ['!has', 'pattern'], ['in', '$type', 'Polygon']],
};

export const POLYGON_FOCUSED_LAYER = {
  id: 'polygon-focused-layer',
  type: 'line',
  paint: {
    'line-color': '#FFFFFF',
    'line-width': [
      'case',
      ['boolean', ['feature-state', 'click'], false],
      10,
      2,
    ],
  },
  filter: ['in', '$type', 'Polygon'],
};
export const POLYGON_LAYER = {
  id: 'polygon-layer',
  type: 'fill',
  paint: {
    // 'fill-pattern': ['coalesce', ['get', 'pattern']],
    'line-color': '#FFFFFF',
    'fill-color': 'red',
    'line-width': [
      'case',
      ['boolean', ['feature-state', 'click'], false],
      10,
      2,
    ],
  },
  style: {
    // fillColor: ['string', ['get', 'fillColor'], 'blue'],
    fillColor: [
      'case',
      ['boolean', ['feature-state', 'click'], false],
      'red',
      ['string', ['get', 'fillColor'], 'blue'],
    ],
    fillOutlineColor: ['string', ['get', 'fillOutlineColor'], 'blue'],
  },
};

const habitats = jsonData.data.getHabitatGeometry.habitats;
const data = habitats.reduce((acc, curr) => {
  const feature = turfCreateFeature(curr.geometry);
  feature.id = curr.id;
  const aiDashCode = curr?.habitatClassification?.aiDash?.code;
  const aiDashStyle = aiDashCode
    ? {
        fillColor:
          aidashPolygonPropertiesMap[curr.habitatClassification.aiDash.code]
            ?.fill,
        fillOutlineColor:
          aidashPolygonPropertiesMap[curr.habitatClassification.aiDash.code]
            ?.stroke,
      }
    : {
        fillColor: 'red',
        fillOutlineColor: 'white',
      };
  feature.properties = {
    id: curr.id,
    ...aiDashStyle,
  };

  acc.push(feature);
  return acc;
}, []);

export const allData = turfCreateFeatureCollection(data, {
  id: 'baseHabitat',
});
export const centroidAidash =
  jsonData.data.getHabitatGeometry.site.centroidGeometry.coordinates;
