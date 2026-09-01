# Mapbox vendored XCFrameworks

All Mapbox native binaries for iOS live here as **one** CocoaPods owner (`MapboxVendor`). Both `@rnmapbox/maps` and `NavigationModule` depend on this pod instead of SPM or CocoaPods `MapboxMaps`.

## Build (once per Mapbox version bump)

Requirements:

- Xcode + Command Line Tools
- Mapbox downloads token in `~/.netrc` (see [Mapbox iOS install](https://docs.mapbox.com/ios/maps/guides/install/))
- Several GB disk space; first run can take 30–60+ minutes

From the project root:

```bash
npm run mapbox:build-xcframeworks
```

Output: `modules/mapbox-vendor/ios/Frameworks/*.xcframework`

Then:

```bash
cd ios && pod install && cd ..
npx expo run:ios
```

## Versions

Aligned with `app.config.js`:

- Mapbox Maps **11.27.3**
- Mapbox Navigation **3.27.3**

## Expected frameworks

After a successful Scipio build you should see (names may vary slightly by Mapbox release):

- `MapboxMaps.xcframework`
- `MapboxCommon.xcframework`
- `MapboxCoreMaps.xcframework`
- `Turf.xcframework`
- `MapboxDirections.xcframework`
- `MapboxNavigationCore.xcframework`
- `MapboxNavigationUIKit.xcframework`
- `MapboxNavigationNative.xcframework`
- `_MapboxNavigationHelpers.xcframework`

Do **not** add CocoaPods `MapboxMaps` or SPM Mapbox packages alongside this pod.
