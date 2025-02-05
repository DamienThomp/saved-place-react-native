import { useTheme } from '@react-navigation/native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePlaceDetails } from '~/api/places';
import Map from '~/components/Map';
import LoadingState from '~/components/common/LoadingState';
import RemoteImage from '~/components/common/RemoteImage';
import IconButton from '~/components/ui/IconButton';

export default function PlaceDetails() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { id } = useLocalSearchParams();

  const locationId = parseFloat(Array.isArray(id) ? id[0] : id);

  const { data: place, isLoading, error } = usePlaceDetails(locationId);

  return (
    <LoadingState isLoading={isLoading} error={error}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={styles.container}>
        {place && (
          <Map coordinates={{ longitude: place.longitude, latitude: place.latitude }} readOnly />
        )}
        <View style={[styles.backButton, { top: insets.top, left: insets.left }]}>
          <IconButton
            icon="chevron-back-circle-sharp"
            size={34}
            color={theme.colors.primary}
            onPress={() => router.back()}
          />
        </View>
        <View style={[styles.overlay]}>
          <View style={styles.overlayContent}>
            <View style={styles.info}>
              <Text style={[styles.title]}>{place?.title}</Text>
              <Text style={[styles.address]}>{place?.address}</Text>
            </View>
            <RemoteImage fallback="" style={styles.image} path={place?.image} />
          </View>
        </View>
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
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 12,
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
