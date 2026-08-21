import { useDirections } from '~/providers/DirectionsProvider';

type UseDirectionsBottomSheetParams = {
  onDismiss: () => void;
};

export function useDirectionsBottomSheet({ onDismiss }: UseDirectionsBottomSheetParams) {
  const { mode, setMode } = useDirections();

  const handlePresentedChange = (open: boolean) => {
    if (!open) {
      onDismiss();
    }
  };

  return {
    mode,
    setMode,
    handlePresentedChange,
  };
}
