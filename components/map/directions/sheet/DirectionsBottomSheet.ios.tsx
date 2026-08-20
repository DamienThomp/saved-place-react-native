import { BottomSheet, Group, Host, RNHostView, Text, VStack } from '@expo/ui/swift-ui';
import {
  padding,
  presentationDetents,
  presentationDragIndicator,
} from '@expo/ui/swift-ui/modifiers';
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
  const {
    mode,
    setMode,
    directionCoordinates,
    routeTime,
    routeDistance,
    handleNavigate,
    handlePresentedChange,
  } = useDirectionsBottomSheet({ coordinates, title, onDismiss });

  return (
    <Host style={{ flex: 1 }}>
      <VStack>
        <BottomSheet
          fitToContents
          isPresented={isPresented}
          onDismiss={onDismiss}
          onIsPresentedChange={handlePresentedChange}>
          <Group modifiers={[presentationDragIndicator('visible')]}>
            <VStack modifiers={[padding({ all: 24 })]}>
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
            </VStack>
          </Group>
        </BottomSheet>
      </VStack>
    </Host>
  );
}
