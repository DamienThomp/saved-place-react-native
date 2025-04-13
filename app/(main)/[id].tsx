import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import LoadingState from '~/components/common/LoadingState';
import RemoteImage from '~/components/common/RemoteImage';
import DirectionButton from '~/components/map/DirectionButton';
import Map from '~/components/map/Map';
import IconButton from '~/components/ui/IconButton';
import { useLocationDetails } from '~/hooks/useLocationDetails';
import { useDirections } from '~/providers/DirectionsProvider';
import { useMapActions } from '~/stores/mapControlsStore';

export default function PlaceDetails() {
  const { setDirections } = useDirections();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { setMapCenter } = useMapActions();

  const { data: place, isLoading, error } = useLocationDetails();

  const toggleToPlace = () => {
    if (place) {
      setMapCenter([place.longitude, place.latitude]);
    }
  };

  const handleBackButton = () => router.back();

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
            <Map
              coordinates={{ longitude: place.longitude, latitude: place.latitude }}
              readOnly
              showControls
            />
          </Animated.View>
        )}
        <View style={[styles.backButton, { top: insets.top, left: insets.left }]}>
          <IconButton
            icon="chevron-back-circle-sharp"
            size={36}
            color="rgba(36, 36, 36, 0.8)"
            onPress={handleBackButton}
          />
        </View>
        <Animated.View style={[styles.overlay]} entering={FadeInDown.duration(500).delay(250)}>
          <View style={styles.overlayContent}>
            <View style={styles.info}>
              <Pressable style={styles.titeContainer} onPress={toggleToPlace}>
                <Text style={[styles.title]}>{place?.title}</Text>
                <Ionicons name="location-sharp" color="red" size={22} />
              </Pressable>
              <Text style={[styles.address]}>{place?.address}</Text>
              {place && (
                <DirectionButton
                  coordinates={{ longitude: place.longitude, latitude: place.latitude }}
                  color="white"
                />
              )}
            </View>
            <RemoteImage style={styles.image} path={place?.image} height={250} contentFit="cover" />
          </View>
        </Animated.View>
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
    height: 50,
    width: 50,
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
  titeContainer: {
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
