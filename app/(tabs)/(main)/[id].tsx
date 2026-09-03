import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import LoadingState from '~/components/common/LoadingState';
import RemoteImage from '~/components/common/RemoteImage';
import DirectionsBottomSheet from '~/components/map/directions/sheet/DirectionsBottomSheet';
import Map from '~/components/map/Map';
import PlaceDetailsInfo from '~/components/place/details/PlaceDetailsInfo';
import PlaceDetailsNavigateSection from '~/components/place/details/PlaceDetailsNavigateSection';
import IconButton from '~/components/ui/IconButton';
import { tokens } from '~/constants/theme';
import { usePlaceDetailsViewModel } from '~/hooks/usePlaceDetailsViewModel';

export default function PlaceDetails() {
  const insets = useSafeAreaInsets();
  const {
    place,
    coordinates,
    isLoading,
    error,
    isNavigating,
    routeTime,
    routeDistance,
    isDirectionsSheetPresented,
    actions,
  } = usePlaceDetailsViewModel();

  return (
    <LoadingState isLoading={isLoading} error={error}>
      <View style={styles.container}>
        {place && (
          <Animated.View
            style={{ height: isNavigating ? '100%' : '75%' }}
            entering={FadeIn.duration(500)}>
            <Map coordinates={coordinates} readOnly showControls />
          </Animated.View>
        )}
        <View style={[styles.backButton, { top: insets.top }]}>
          <IconButton
            accessibilityLabel="Go back"
            icon="chevron-back"
            size={24}
            color={tokens.colors.white}
            onPress={actions.handleBackButton}
          />
        </View>
        {place && (
          <Animated.View style={styles.overlay} entering={FadeInDown.duration(500).delay(250)}>
            <View style={styles.overlayContent}>
              <PlaceDetailsInfo
                place={place}
                onCenterMap={actions.toggleToPlace}
                onOpenDirections={actions.openDirectionsSheet}
              />
              {isNavigating ? (
                <PlaceDetailsNavigateSection
                  routeTime={routeTime}
                  routeDistance={routeDistance}
                  onNavigate={actions.navigateToPlace}
                />
              ) : (
                <RemoteImage
                  style={styles.image}
                  path={place.image}
                  height={250}
                  contentFit="cover"
                />
              )}
            </View>
          </Animated.View>
        )}
        {place && (
          <DirectionsBottomSheet
            isPresented={isDirectionsSheetPresented}
            onDismiss={actions.dismissDirectionsSheet}
            coordinates={{ longitude: place.longitude, latitude: place.latitude }}
          />
        )}
      </View>
    </LoadingState>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: tokens.spacing.sm,
    backgroundColor: tokens.colors.overlay.darkGlass,
    borderRadius: tokens.borderRadius.pill,
    marginTop: tokens.spacing.xs,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    left: 0,
    bottom: 0,
  },
  overlayContent: {
    flex: 1,
    justifyContent: 'space-evenly',
    backgroundColor: tokens.colors.overlay.darkGlass,
    borderRadius: tokens.borderRadius.lg,
  },
  image: {
    width: '100%',
    height: 250,
  },
});
