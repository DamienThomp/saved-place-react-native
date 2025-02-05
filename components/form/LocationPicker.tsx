import { useTheme } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, ActionSheetIOS, Image, Pressable, StyleSheet, Alert } from 'react-native';

import ContentUnavailable from '../common/ContentUnavailable';

import useUserLocation from '~/hooks/useUserLocation';
import { getAddress, takeSnapshot } from '~/utils/mapBoxUtils';

enum LocationOptions {
  Cancel = 'Cancel',
  User = 'My Location',
  Map = 'Locate on Map',
}

interface LocationPickerProps {
  onSelectLocation: (coordinates: number[], address: string) => void;
}

export default function LocationPicker({ onSelectLocation }: LocationPickerProps) {
  const [pickedLocation, setPickedLocation] = useState<string | null>(null);
  const router = useRouter();
  const theme = useTheme();
  const location = useUserLocation();

  const params = useLocalSearchParams<{ coordinate: string }>();

  const handleLocateUser = async () => {
    if (!location) return;

    const centerCoordinate = [location.longitude, location.latitude];
    const uri = await takeSnapshot({ centerCoordinate });
    const address = await getAddress({ centerCoordinate });

    onSelectLocation(centerCoordinate, address);
    setPickedLocation(uri);
  };

  const handleLocateOnMap = () => {
    router.push('/(main)/map-modal');
  };

  const onPickLocation = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [LocationOptions.User, LocationOptions.Map, LocationOptions.Cancel],
          destructiveButtonIndex: 2,
          cancelButtonIndex: 2,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            handleLocateUser();
          }
          if (buttonIndex === 1) {
            handleLocateOnMap();
          }
        }
      );
    }

    if (Platform.OS === 'android') {
      Alert.alert('Pick a Place', '', [
        {
          text: LocationOptions.Cancel,
          style: 'cancel',
        },
        { text: LocationOptions.User, onPress: () => handleLocateUser() },
        { text: LocationOptions.Map, onPress: () => handleLocateOnMap() },
      ]);
    }
  };

  const getSnapshot = async () => {
    if (params?.coordinate) {
      const coordinate = JSON.parse(params.coordinate);
      const uri = await takeSnapshot({ centerCoordinate: coordinate });
      const address = await getAddress({ centerCoordinate: coordinate });

      onSelectLocation(coordinate, address);
      setPickedLocation(uri);
    }
  };

  useEffect(() => {
    getSnapshot();
  }, [params.coordinate]);

  let mapPreview = (
    <ContentUnavailable color="grey" icon="map-outline">
      Select a location.
    </ContentUnavailable>
  );

  if (pickedLocation) {
    mapPreview = <Image source={{ uri: pickedLocation }} style={styles.image} />;
  }

  return (
    <Pressable
      onPress={onPickLocation}
      style={({ pressed }) => [
        styles.preview,
        {
          backgroundColor: pressed ? theme.colors.background : theme.colors.card,
          borderColor: theme.colors.border,
        },
      ]}>
      {mapPreview}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  preview: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    resizeMode: 'cover',
  },
});
