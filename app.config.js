export default {
  expo: {
    name: "saved-place",
    slug: "saved-place",
    version: "1.0.0",
    scheme: "saved-place",
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/favicon.png"
    },
    plugins: [
        "expo-router",
        [
          "@rnmapbox/maps",
          {
            RNMapboxMapsDownloadToken: process.env.EXPO_PUBLIC_MAPBOX_TOKEN
          }
        ],
        [
          "expo-location",
          {
            locationAlwaysAndWhenInUsePermission: "Allow $(PRODUCT_NAME) to use your location."
          }
        ],
        [
          "expo-image-picker",
          {
            photosPermission: "Allow $(PRODUCT_NAME) to use your photos'.",
            cameraPermission: "Allow $(PRODUCT_NAME) to access your camera"
          }
        ],
        [
          "expo-splash-screen",
          {
            backgroundColor: "#000000",
            image: "./assets/splashIcon.png",
            resizeMode: "contain",
            dark: {
              backgroundColor: "#000000",
              image: "./assets/splashIcon.png"
            },
            imageWidth: 600
          }
        ],
        "expo-secure-store",
        "expo-font"
      ],
      experiments: {
        typedRoutes: true,
        tsconfigPaths: true
      },
      orientation: "portrait",
      icon: "./assets/appIcon.png",
      userInterfaceStyle: "automatic",
      assetBundlePatterns: [
        "**/*"
      ],
      ios: {
        supportsTablet: false,
        bundleIdentifier: "com.anonymous.savedplace",
        infoPlist: {
          ITSAppUsesNonExemptEncryption: false
        }
      },
      android: {
        adaptiveIcon: {
          foregroundImage: "./assets/appIcon.png",
          backgroundColor: "#000000"
        },
        package: "com.anonymous.savedplace",
        permissions: [
          "android.permission.ACCESS_COARSE_LOCATION",
          "android.permission.ACCESS_FINE_LOCATION",
          "android.permission.RECORD_AUDIO"
        ]
      },
      extra: {
        router: {
          origin: false
        },
        eas: {
          projectId: "0d391893-66d8-41b8-b2e6-5265f67481e8"
        }
      }
  }
};