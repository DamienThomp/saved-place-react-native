import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';

import { useLocationDetails } from '~/hooks/useLocationDetails';
import { useStartNavigation } from '~/hooks/useStartNavigation';
import { useDirections } from '~/providers/DirectionsProvider';
import { useMapActions } from '~/stores/mapControlsStore';
import { MAP_CAMERA } from '~/utils/mapBoxUtils';

export function usePlaceDetailsViewModel() {
  const router = useRouter();
  const { flyTo } = useMapActions();
  const { clearDirections, directionCoordinates, routeTime, routeDistance } = useDirections();
  const [isDirectionsSheetPresented, setIsDirectionsSheetPresented] = useState(false);

  const { data: place, isLoading, error } = useLocationDetails();

  const coordinates = useMemo(() => {
    if (!place) return;

    return { longitude: place.longitude, latitude: place.latitude };
  }, [place]);

  const { startNavigation } = useStartNavigation();

  useEffect(() => {
    return () => {
      clearDirections?.();
    };
  }, [clearDirections]);

  const toggleToPlace = () => {
    if (!place) return;

    flyTo([place.longitude, place.latitude], MAP_CAMERA.PLACE_DETAIL_ZOOM);
  };

  const handleBackButton = () => router.back();

  const openDirectionsSheet = () => {
    setIsDirectionsSheetPresented(true);
  };

  const dismissDirectionsSheet = () => {
    setIsDirectionsSheetPresented(false);
  };

  const navigateToPlace = () => {
    if (!place || !coordinates) return;

    startNavigation({ coordinates, title: place.title });
  };

  return {
    place,
    coordinates,
    isLoading,
    error,
    directionCoordinates,
    routeTime,
    routeDistance,
    isDirectionsSheetPresented,
    actions: {
      toggleToPlace,
      handleBackButton,
      openDirectionsSheet,
      dismissDirectionsSheet,
      navigateToPlace,
    },
  };
}
