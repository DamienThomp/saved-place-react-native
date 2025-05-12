import MapControlContainer from './MapControlContainer';
import IconButton from '../ui/IconButton';

import { useIsLightMode, useMapActions } from '~/stores/mapControlsStore';

export default function MapThemeToggleButton() {
  const isLightMode = useIsLightMode();
  const { toggleLightMode } = useMapActions();

  const onToggleLightMode = () => toggleLightMode(!isLightMode);

  return (
    <MapControlContainer>
      <IconButton
        icon={isLightMode ? 'sunny-sharp' : 'moon-sharp'}
        color="white"
        size={28}
        onPress={onToggleLightMode}
      />
    </MapControlContainer>
  );
}
