import { registerWebModule, NativeModule } from 'expo';

// NavigationModule is not available on the web platform.
class NavigationModule extends NativeModule<{}> {}

export default registerWebModule(NavigationModule, 'NavigationModule');
