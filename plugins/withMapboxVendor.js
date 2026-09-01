const fs = require('fs');
const path = require('path');
const { withDangerousMod } = require('expo/config-plugins');
const { mergeContents } = require('@expo/config-plugins/build/utils/generateCode');

const INSERTIONS = [
  {
    tag: '@saved-place/mapbox-vendor-rnmapboxmapsimpl',
    anchor: /^prepare_react_native_project!/m,
    newSrc: "$RNMapboxMapsCustomPods = [['MapboxVendor']]",
  },
  {
    tag: '@saved-place/mapbox-vendor-pod',
    anchor: /^target 'savedplace' do$/m,
    newSrc: "  pod 'MapboxVendor', :path => '../modules/mapbox-vendor/ios'",
  },
];

function withMapboxVendor(config) {
  return withDangerousMod(config, [
    'ios',
    (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      if (!fs.existsSync(podfilePath)) {
        return config;
      }

      let contents = fs.readFileSync(podfilePath, 'utf8');
      for (const { tag, anchor, newSrc } of INSERTIONS) {
        contents = mergeContents({
          tag,
          src: contents,
          newSrc,
          anchor,
          offset: 1,
          comment: '#',
        }).contents;
      }

      fs.writeFileSync(podfilePath, contents);
      return config;
    },
  ]);
}

module.exports = withMapboxVendor;
