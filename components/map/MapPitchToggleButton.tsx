import MapControlContainer from './MapControlContainer';
import IconButton from '../ui/IconButton';

import { useIsPitchToggled, useMapActions } from '~/stores/mapControlsStore';
import { tokens } from '~/constants/theme';

export default function MapPitchToggleButton() {
  const isPitchToggled = useIsPitchToggled();
  const { toggleMapPitch } = useMapActions();

  const onTogglePitch = () => {
    toggleMapPitch();
  };

  return (
    <MapControlContainer>
      <IconButton
        icon={isPitchToggled ? 'layers-outline' : 'layers'}
        color={tokens.colors.white}
        size={28}
        accessibilityLabel="Toggle map pitch"
        onPress={onTogglePitch}
      />
    </MapControlContainer>
  );
}
