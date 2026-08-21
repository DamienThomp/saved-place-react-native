import { DirectionsBottomSheetProps } from '~/components/map/directions/sheet/sheetProps';

export type { DirectionsBottomSheetProps };

export default function DirectionsBottomSheet(_props: DirectionsBottomSheetProps): never {
  throw new Error('DirectionsBottomSheet is only supported on iOS and Android.');
}
