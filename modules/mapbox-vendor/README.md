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

- Mapbox Maps **11.27.3** (iOS via vendored XCFrameworks; Android via `@rnmapbox/maps` + Navigation SDK Maven artifact)
- Mapbox Navigation **3.27.3** (iOS vendored; Android `com.mapbox.navigationcore:android-ndk27:3.27.3` in `navigation-module`)

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

## Android (NavigationModule)

The Android navigation module pulls Mapbox Navigation SDK v3 from Maven during Gradle sync/build:

- Artifact: `com.mapbox.navigationcore:android-ndk27:3.27.3`
- Requires `RNMAPBOX_MAPS_DOWNLOAD_TOKEN` in `.env` with **Downloads:Read** scope (`sk.` token, build-time only)
- Runtime maps/navigation use `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN` (`pk.` token)

After changing Mapbox versions:

```bash
npx expo prebuild --platform android
npx expo run:android
```
