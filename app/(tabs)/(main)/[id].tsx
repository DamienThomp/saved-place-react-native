import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import LoadingState from '~/components/common/LoadingState';
import RemoteImage from '~/components/common/RemoteImage';
import DirectionsBottomSheet from '~/components/map/directions/sheet/DirectionsBottomSheet';
import Map from '~/components/map/Map';
import { Button } from '~/components/ui/Button';
import IconButton from '~/components/ui/IconButton';
import { usePlaceDetailsViewModel } from '~/hooks/usePlaceDetailsViewModel';
import { formatRouteDistance, formatRouteDuration } from '~/utils/formatRoute';

export default function PlaceDetails() {
  const insets = useSafeAreaInsets();
  const {
    place,
    coordinates,
    isLoading,
    error,
    directionCoordinates,
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
            style={{ height: directionCoordinates ? '100%' : '75%' }}
            entering={FadeIn.duration(500)}>
            <Map coordinates={coordinates} readOnly showControls />
          </Animated.View>
        )}
        <View style={[styles.backButton, { top: insets.top }]}>
          <IconButton
            accessibilityLabel="Go back"
            icon="chevron-back"
            size={24}
            color="white"
            onPress={actions.handleBackButton}
          />
        </View>
        <Animated.View style={[styles.overlay]} entering={FadeInDown.duration(500).delay(250)}>
          <View style={styles.overlayContent}>
            <View style={styles.info}>
              <View style={styles.titleRow}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Center map on place"
                  style={styles.titleContainer}
                  onPress={actions.toggleToPlace}>
                  <Text style={[styles.title]}>{place?.title}</Text>
                  <Ionicons name="location-sharp" color="red" size={18} />
                </Pressable>
              </View>
              <View style={styles.addressContainer}>
                <Text style={[styles.address]}>{place?.address}</Text>
                {place && (
                  <Button
                    accessibilityLabel="Get directions"
                    icon="directions"
                    size={22}
                    color="white"
                    onPress={actions.openDirectionsSheet}
                  />
                )}
              </View>
            </View>
            {directionCoordinates && (
              <View style={styles.navigateSection}>
                <Text style={styles.routeSummary}>
                  {formatRouteDuration(routeTime)} · {formatRouteDistance(routeDistance)}
                </Text>
                <Button
                  title="Navigate to place"
                  icon="directions"
                  color="white"
                  onPress={actions.navigateToPlace}
                  style={styles.navigateButton}
                />
              </View>
            )}
            {!directionCoordinates && (
              <RemoteImage
                style={styles.image}
                path={place?.image}
                height={250}
                contentFit="cover"
              />
            )}
          </View>
        </Animated.View>
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
    left: 8,
    backgroundColor: 'rgba(36, 36, 36, 0.8)',
    borderRadius: 22,
    marginTop: 4,
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
    backgroundColor: 'rgba(36, 36, 36, 0.8)',
    borderRadius: 12,
  },
  info: {
    padding: 18,
    marginTop: 12,
    gap: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    color: 'white',
  },
  address: {
    fontSize: 18,
    color: 'white',
    flexWrap: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '80%',
  },
  navigateSection: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    gap: 12,
  },
  routeSummary: {
    fontSize: 16,
    color: 'white',
  },
  navigateButton: {
    alignSelf: 'stretch',
  },
  image: {
    width: '100%',
    height: 250,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
});
