import MapboxGL from '@rnmapbox/maps';
export const downloadRoute = async ({name, onProgress, onError}) => {
  try {
    await MapboxGL.offlineManager.createPack(
      {
        name: name,
        styleURL: 'mapbox://styles/aidash-ivms/cketrj9ev4dwu19p3dx747e19',
        minZoom: 14,
        maxZoom: 20,
        bounds: [
          [-0.27128813262367544, 52.64822202120186],
          [-0.28128813262367544, 52.64822202120187],
        ],
      },
      onProgress,
      onError,
    );
    console.log('Downloading');
  } catch (err) {
    onError(err);
  }
};
