import { NavigationModuleViewProps } from './NavigationModule.types';

// NavigationModuleView is not available on the web platform.
export default function NavigationModuleView(_props: NavigationModuleViewProps) {
  throw new Error('NavigationModuleView is not available on the web platform.');
}
