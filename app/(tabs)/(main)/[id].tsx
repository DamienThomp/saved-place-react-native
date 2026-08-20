import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import LoadingState from '~/components/common/LoadingState';
import RemoteImage from '~/components/common/RemoteImage';
import DirectionsBottomSheet from '~/components/map/directions/sheet/DirectionsBottomSheet';
import Map from '~/components/map/Map';
import IconButton from '~/components/ui/IconButton';
import { useLocationDetails } from '~/hooks/useLocationDetails';
import { useDirections } from '~/providers/DirectionsProvider';
import { useMapActions } from '~/stores/mapControlsStore';
import { MAP_CAMERA } from '~/utils/mapBoxUtils';

export default function PlaceDetails() {
  const { setDirections } = useDirections();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { flyTo } = useMapActions();
  const [isDirectionsSheetPresented, setIsDirectionsSheetPresented] = useState(false);

  const { data: place, isLoading, error } = useLocationDetails();

  const coordinates = useMemo(() => {
    if (!place) return;

    return { longitude: place.longitude, latitude: place.latitude };
  }, [place]);

  const toggleToPlace = () => {
    if (!place) return;

    flyTo([place.longitude, place.latitude], MAP_CAMERA.PLACE_DETAIL_ZOOM);
  };

  const handleBackButton = () => router.back();

  const openDirectionsSheet = () => {
    setIsDirectionsSheetPresented(true);
  };

  useEffect(() => {
    setDirections?.(null);
    return () => {
      setDirections?.(null);
    };
  }, []);

  return (
    <LoadingState isLoading={isLoading} error={error}>
      <View style={styles.container}>
        {place && (
          <Animated.View style={{ height: '75%' }} entering={FadeIn.duration(500)}>
            <Map coordinates={coordinates} readOnly showControls />
          </Animated.View>
        )}
        <View style={[styles.backButton, { top: insets.top }]}>
          <IconButton
            accessibilityLabel="Go back"
            icon="chevron-back"
            size={24}
            color="white"
            onPress={handleBackButton}
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
                  onPress={toggleToPlace}>
                  <Text style={[styles.title]}>{place?.title}</Text>
                  <Ionicons name="location-sharp" color="red" size={18} />
                </Pressable>
                {place && (
                  <IconButton
                    accessibilityLabel="Get directions"
                    icon="navigate"
                    size={22}
                    color="white"
                    onPress={openDirectionsSheet}
                  />
                )}
              </View>
              <Text style={[styles.address]}>{place?.address}</Text>
            </View>
            <RemoteImage style={styles.image} path={place?.image} height={250} contentFit="cover" />
          </View>
        </Animated.View>
        {place && (
          <DirectionsBottomSheet
            isPresented={isDirectionsSheetPresented}
            onDismiss={() => setIsDirectionsSheetPresented(false)}
            coordinates={{ longitude: place.longitude, latitude: place.latitude }}
            title={place.title}
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
  },
  image: {
    width: '100%',
    height: 250,
  },
});
