import MapControlContainer from './MapControlContainer';
import IconButton from '../ui/IconButton';

import { useIsLightMode, useMapActions } from '~/stores/mapControlsStore';
import { tokens } from '~/constants/theme';

export default function MapThemeToggleButton() {
  const isLightMode = useIsLightMode();
  const { toggleLightMode } = useMapActions();

  const onToggleLightMode = () => toggleLightMode();

  return (
    <MapControlContainer>
      <IconButton
        icon={isLightMode ? 'sunny-sharp' : 'moon-sharp'}
        color={tokens.colors.white}
        size={28}
        accessibilityLabel="Toggle map theme"
        onPress={onToggleLightMode}
      />
    </MapControlContainer>
  );
}
