#!/usr/bin/env bash
# Builds Mapbox Maps + Navigation XCFrameworks via Scipio and copies them into MapboxVendor.
# Requires: Xcode, git, Mapbox token in ~/.netrc
#
# Usage: MAPBOX_NAV_VERSION=3.27.3 ./scripts/build-mapbox-xcframeworks.sh

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORK="${MAPBOX_BUILD_DIR:-$ROOT/.mapbox-vendor-build}"
OUT="$ROOT/modules/mapbox-vendor/ios/Frameworks"
NAV_VERSION="${MAPBOX_NAV_VERSION:-3.27.3}"
SCIPio_VERSION="${SCIPio_GIT_REF:-main}"

echo "==> Mapbox vendored XCFramework build"
echo "    Navigation tag: v${NAV_VERSION}"
echo "    Output:         $OUT"
echo "    Work dir:       $WORK"

if ! grep -q 'api.mapbox.com' "$HOME/.netrc" 2>/dev/null; then
  echo "ERROR: Mapbox downloads token not found in ~/.netrc"
  echo "See https://docs.mapbox.com/ios/maps/guides/install/"
  exit 1
fi

mkdir -p "$OUT" "$WORK" "$ROOT/.mapbox-vendor-build"

clone_repo() {
  local url="$1"
  local dir="$2"
  local ref="$3"
  if [[ -d "$dir/.git" ]]; then
    echo "==> Updating $(basename "$dir")"
    git -C "$dir" fetch --depth 1 origin "$ref" 2>/dev/null || true
    git -C "$dir" checkout -f FETCH_HEAD 2>/dev/null || git -C "$dir" checkout -f "$ref"
  else
    echo "==> Cloning $(basename "$dir")"
    git clone --depth 1 --branch "$ref" "$url" "$dir"
  fi
}

NAV_DIR="$WORK/mapbox-navigation-ios"
SCIPio_DIR="$WORK/Scipio"

clone_repo "https://github.com/mapbox/mapbox-navigation-ios.git" "$NAV_DIR" "v${NAV_VERSION}"
clone_repo "https://github.com/giginet/Scipio.git" "$SCIPio_DIR" "$SCIPio_VERSION"

echo "==> Installing minimal Package.swift for Scipio"
cp "$ROOT/scripts/mapbox-vendor/Package.swift.scipio" "$NAV_DIR/Package.swift"

echo "==> Resolving Swift packages (may take several minutes)"
( cd "$NAV_DIR" && swift package resolve )

echo "==> Building Scipio CLI"
( cd "$SCIPio_DIR" && swift build -c release )

echo "==> Running Scipio (this can take 30–60+ minutes on first run)"
( cd "$SCIPio_DIR" && swift run -c release scipio create "$NAV_DIR" -f \
  --platforms iOS \
  --only-use-versions-from-resolved-file \
  --enable-library-evolution \
  --support-simulators \
  --embed-debug-symbols \
  --verbose )

XC_ROOT="$NAV_DIR/XCFrameworks"
if [[ ! -d "$XC_ROOT" ]]; then
  XC_ROOT="$(find "$NAV_DIR" -type d -name XCFrameworks | head -1)"
fi

if [[ -z "$XC_ROOT" || ! -d "$XC_ROOT" ]]; then
  echo "ERROR: Could not find XCFrameworks output under $NAV_DIR"
  exit 1
fi

echo "==> Copying XCFrameworks from $XC_ROOT"
rm -rf "$OUT"/*.xcframework
cp -R "$XC_ROOT"/*.xcframework "$OUT"/

echo "==> Done. Frameworks installed:"
ls -1 "$OUT"
