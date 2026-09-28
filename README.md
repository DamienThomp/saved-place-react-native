# Saved Place

A React Native demo app for saving and revisiting places. Sign in, capture a title, photo, and location, then browse your saved places in a list, on a detail map, or on a global clustered map. Mapbox powers maps, search, geocoding, directions, and turn-by-turn navigation; Supabase handles auth, data, and image storage.

Built with Expo SDK 56, Expo Router, and an MVVM screen architecture. Targets iOS and Android via a dev client (`expo run:ios` / `expo run:android`).

## Features

### Authentication

- **Email/password sign-in and sign-up** — Supabase Auth with session persistence in Secure Store
- **Auth gate** — Unauthenticated users redirect to sign-in; authenticated users land on the main tab

### Places

- **Create & edit** — Title, photo (camera or library), and location via GPS, map tap, or Mapbox Search Box
- **Reverse geocoding** — Address resolved from coordinates when picking a location on the map
- **List view** — Card layout with title search, pull-to-refresh, infinite scroll (5 items per page), and edit mode for update/delete
- **Image storage** — Photos uploaded to Supabase Storage (`place-images` bucket) with signed URLs for display

### Place details

- **Interactive map** — Mapbox map with pin, overlay card (photo, title, address), and camera fly-to
- **Map controls** — Map style toggle (Standard / Outdoors / Satellite), pitch toggle, and recenter on user location
- **Directions** — Route preview on the map with travel mode selector and bottom sheet (time/distance)
- **Turn-by-turn navigation (iOS)** — Full-screen native navigation via the local `NavigationModule` Expo module

### Global map

- **Clustered map** — All saved places on one map with marker clustering
- **Persisted cache** — Place list data cached offline via TanStack Query + MMKV

### Profile

- **Account tab** — Signed-in user email and sign out

## Architecture

Saved Place follows MVVM with thin route files:

| Layer | Description |
| ----- | ----------- |
| **Views** | Screen components in `screens/` render UI and bind to view model hooks |
| **ViewModels** | `use<Screen>ViewModel` hooks own state, validation, navigation, and side effects |
| **Model** | Types in `types/`; Supabase and Mapbox access in `lib/` and `api/` via TanStack Query |
| **Routes** | `app/` files are thin re-exports; layouts and tab structure live in `app/**/_layout.tsx` |
| **Providers** | Cross-cutting context — auth, query persistence, location, directions, map search |
| **Stores** | Zustand stores for map controls, edit mode, and map selection |
| **Native modules** | `NavigationModule` (turn-by-turn UI); `MapboxVendor` (vendored Mapbox XCFrameworks on iOS) |

Key integrations:

- **[Mapbox](https://www.mapbox.com/)** — `@rnmapbox/maps` for map views; Search Box API for place search; Geocoding v6 for reverse geocode; Directions API for routes
- **[Supabase](https://supabase.com/)** — Auth, PostgreSQL (`places`, `profiles`), Storage for images, row-level scoping per user
- **MapboxVendor** — Single CocoaPods owner for Mapbox Maps + Navigation native binaries on iOS ([details](modules/mapbox-vendor/README.md))
- **NavigationModule** — Local Expo module wrapping Mapbox Navigation SDK (iOS native view; Android in progress)

## Requirements

- Node.js 18+ and npm
- Expo dev client workflow (native `ios/` and `android/` directories)
- **Supabase project** — Auth enabled, `places` table, `profiles` table, `place-images` storage bucket with appropriate RLS policies
- **Mapbox account** — Public access token (`pk.`) for runtime maps/APIs
- **Mapbox downloads token** (`sk.` with Downloads:Read) — Required for iOS native SDK download and Android Gradle sync
- **Xcode** (iOS 16.4+) — Required for iOS builds; first-time iOS setup needs a vendored Mapbox build (see Setup)
- **Android Studio / SDK** — For Android builds

## Setup

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd saved-place
   npm install
   ```

2. **Configure environment**

   Create a `.env` file in the project root:

   | Key | Description |
   | --- | ----------- |
   | `EXPO_PUBLIC_DB_URL` | Supabase project URL |
   | `EXPO_PUBLIC_DB_API_KEY` | Supabase anon/public key |
   | `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN` | Mapbox public token (`pk.`) — maps, search, geocoding, directions |
   | `RNMAPBOX_MAPS_DOWNLOAD_TOKEN` | Mapbox secret downloads token (`sk.`) — Android Gradle / `@rnmapbox/maps` native deps |

3. **Configure Supabase**

   In your Supabase project:

   - Enable email/password auth
   - Create a `places` table (`id`, `title`, `address`, `latitude`, `longitude`, `image`, `user_id`, `created_at`)
   - Create a `profiles` table linked to auth users
   - Create a public `place-images` storage bucket
   - Add RLS policies so users can only read/write their own places and images

4. **iOS — build vendored Mapbox frameworks**

   iOS links Mapbox through `MapboxVendor` instead of SPM/CocoaPods `MapboxMaps`. Build the XCFrameworks once (or after a Mapbox version bump):

   ```bash
   # Add your downloads token to ~/.netrc first — see modules/mapbox-vendor/README.md
   npm run mapbox:build-xcframeworks
   ```

5. **Run the app**

   ```bash
   # iOS
   cd ios && pod install && cd ..
   npx expo run:ios

   # Android
   npx expo run:android
   ```

   Start the dev server separately if needed:

   ```bash
   npm start
   ```

## Project structure

```
saved-place/
├── app/                    # Expo Router routes (thin re-exports + layouts)
│   ├── (auth)/             # Sign-in, sign-up
│   └── (tabs)/             # Main list, global map, profile
├── screens/                # Screen views + use*ViewModel hooks
├── components/             # Shared UI (map, place cards, forms, auth)
├── api/                    # TanStack Query hooks (places, auth, directions, geocode, search)
├── lib/                    # Supabase client, query persister
├── providers/              # Auth, Query, Location, Directions, MapSearch
├── stores/                 # Zustand (map controls, edit mode, selection)
├── hooks/                  # Composable hooks used by view models
├── modules/
│   ├── mapbox-vendor/      # Vendored Mapbox XCFrameworks (iOS)
│   └── navigation-module/  # Expo module for turn-by-turn navigation
├── plugins/                # Expo config plugins (withMapboxVendor)
├── scripts/                # Mapbox XCFramework build script
├── msw/                    # Mock Service Worker handlers for tests
└── test/                   # Vitest setup and test utilities
```

## Testing

The project uses [Vitest](https://vitest.dev/) with [vitest-native](https://www.npmjs.com/package/vitest-native) and MSW for API mocking.

```bash
npm test              # run once
npm run test:watch    # watch mode
```

Coverage includes auth, places CRUD, geocoding, directions, form validation, filtering, and database helpers.

## Permissions

The app requests:

- **Location** — Current position for map centering, place creation, and navigation origin
- **Camera** — Capture photos for saved places
- **Photo Library** — Pick existing photos for saved places

## Roadmap

- [ ] Turn-by-turn navigation on Android
- [ ] Update screenshots and add screen recording

## Screenshots

### Place List

<img width="180" src="https://github.com/user-attachments/assets/6939b2c4-e9f8-4f6a-ba77-9df841625c23">
<img width="180" src="https://github.com/user-attachments/assets/3f6f9266-ec5e-48ba-a38b-7c892b571827">
<img width="180" src="https://github.com/user-attachments/assets/e965c27a-d8be-45d2-a0db-effb8c16285d">
<img width="180" src="https://github.com/user-attachments/assets/e485d4f9-b684-4186-9610-f3a0fa7d8386">

### Place Form

<img width="200" src="https://github.com/user-attachments/assets/1c671c23-872d-41ff-990f-c290dda93aa9">
<img width="200" src="https://github.com/user-attachments/assets/19c7718a-e43f-43e8-9fd5-d36bfaa41434">
<img width="200" src="https://github.com/user-attachments/assets/c2b513dd-b912-41c0-9f5a-16acbb3a9064">

### Details

<img width="200" src="https://github.com/user-attachments/assets/f7b15d93-dd4b-4798-8852-095074f94a26">
<img width="200" src="https://github.com/user-attachments/assets/64477499-282c-4871-aaad-2a9ac54da6e5">
<img width="200" src="https://github.com/user-attachments/assets/88122658-9aa3-48d3-a02c-009a2e013e01">
