import { useTheme } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePlaceDetails } from '~/api/places';
import LoadingState from '~/components/common/LoadingState';
import RemoteImage from '~/components/common/RemoteImage';
import DirectionButton from '~/components/map/DirectionButton';
import Map from '~/components/map/Map';
import IconButton from '~/components/ui/IconButton';
import { useDirections } from '~/providers/DirectionsProvider';

export default function PlaceDetails() {
  const { setDirections } = useDirections();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { id } = useLocalSearchParams();

  const locationId = parseFloat(Array.isArray(id) ? id[0] : id);

  const { data: place, isLoading, error } = usePlaceDetails(locationId);

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
          <Map
            coordinates={{ longitude: place.longitude, latitude: place.latitude }}
            readOnly
            showControls
          />
        )}
        <View style={[styles.backButton, { top: insets.top, left: insets.left }]}>
          <IconButton
            icon="chevron-back-circle-sharp"
            size={34}
            color={theme.colors.primary}
            onPress={() => router.back()}
          />
        </View>
        <Animated.View style={[styles.overlay]} entering={FadeInDown.duration(500).delay(250)}>
          <View style={styles.overlayContent}>
            <View style={styles.info}>
              <Text style={[styles.title]}>{place?.title}</Text>
              <Text style={[styles.address]}>{place?.address}</Text>
              {place && (
                <DirectionButton
                  coordinates={{ longitude: place.longitude, latitude: place.latitude }}
                  color="white"
                />
              )}
            </View>
            <RemoteImage fallback="" style={styles.image} path={place?.image} height={250} />
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
    resizeMode: 'cover',
    width: '100%',
    height: 250,
  },
});
