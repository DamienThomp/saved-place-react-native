import {
  Column,
  Host,
  ModalBottomSheet,
  RNHostView,
  Text,
} from '@expo/ui/jetpack-compose';
import type { ModalBottomSheetRef } from '@expo/ui/jetpack-compose';
import { paddingAll } from '@expo/ui/jetpack-compose/modifiers';
import { useCallback, useRef } from 'react';
import { View } from 'react-native';

import DirectionTypeSelector from '~/components/map/directions/selector/DirectionTypeSelector';
import DirectionsBottomSheetContent from '~/components/map/directions/sheet/DirectionsBottomSheetContent';
import { DirectionsBottomSheetProps } from '~/components/map/directions/sheet/sheetProps';
import { useDirectionsBottomSheet } from '~/components/map/directions/sheet/useDirectionsBottomSheet';

export default function DirectionsBottomSheet({
  isPresented,
  onDismiss,
  coordinates,
  title,
}: DirectionsBottomSheetProps) {
  const sheetRef = useRef<ModalBottomSheetRef>(null);

  const dismissSheet = useCallback(async () => {
    await sheetRef.current?.hide();
    onDismiss();
  }, [onDismiss]);

  const {
    mode,
    setMode,
    directionCoordinates,
    routeTime,
    routeDistance,
    handleNavigate,
  } = useDirectionsBottomSheet({ coordinates, title, onDismiss: dismissSheet });

  if (!isPresented) {
    return null;
  }

  return (
    <Host matchContents style={{ flex: 1 }}>
      <ModalBottomSheet ref={sheetRef} onDismissRequest={onDismiss} skipPartiallyExpanded={false}>
        <Column verticalArrangement={{ spacedBy: 16 }} modifiers={[paddingAll(24)]}>
          <Text>Get directions</Text>

          {mode && setMode && <DirectionTypeSelector value={mode} onChange={setMode} />}

          <RNHostView matchContents>
            <View style={{ width: '100%' }}>
              <DirectionsBottomSheetContent
                coordinates={coordinates}
                directionCoordinates={directionCoordinates}
                routeTime={routeTime}
                routeDistance={routeDistance}
                onNavigate={handleNavigate}
              />
            </View>
          </RNHostView>
        </Column>
      </ModalBottomSheet>
    </Host>
  );
}
