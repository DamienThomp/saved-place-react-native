import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';

import Map, { SelectedPoint } from '~/components/map/Map';
import IconButton from '~/components/ui/IconButton';

export default function MapModal() {
  const [selectedPlace, setSelectedPlace] = useState<number[] | null>(null);
  const router = useRouter();

  const onMapSelection = (selection: SelectedPoint | null) => {
    if (!selection) return;
    const [longitude, latitude] = selection.coordinate;
    setSelectedPlace([longitude, latitude]);
  };

  const onSubmit = () => {
    router.back();
    router.setParams({ coordinate: JSON.stringify(selectedPlace) });
  };

  return (
    <>
      <Stack.Screen
        name="map-modal"
        options={{
          title: 'Select a Location',
          presentation: 'modal',
          headerRight: () => (
            <IconButton
              icon="checkmark-circle-outline"
              color="green"
              size={24}
              onPress={onSubmit}
            />
          ),
          headerLeft: () => (
            <IconButton
              icon="close-circle-outline"
              color="red"
              size={24}
              onPress={() => router.back()}
            />
          ),
        }}
      />
      <Map onPress={onMapSelection} />
    </>
  );
}
