import { requireNativeView } from 'expo';
import * as React from 'react';

import { NavigationModuleViewProps } from './NavigationModule.types';

const NativeView: React.ComponentType<NavigationModuleViewProps> = requireNativeView('NavigationModule');

export default function NavigationModuleView(props: NavigationModuleViewProps) {
  return <NativeView {...props} />;
}
