import { NativeModule, requireNativeModule } from 'expo';

declare class NavigationModule extends NativeModule<{}> {}

export default requireNativeModule<NavigationModule>('NavigationModule');
