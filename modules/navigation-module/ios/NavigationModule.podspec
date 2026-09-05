Pod::Spec.new do |s|
  s.name           = 'NavigationModule'
  s.version        = '1.0.0'
  s.summary        = 'Mapbox Navigation Expo module for iOS'
  s.description    = 'iOS implementation of the NavigationModule Expo module. Wraps Mapbox Navigation SDK (via MapboxVendor) and exposes a native view with origin, destination, and mode props. Requires ExpoModulesCore and MapboxVendor.'
  s.author         = 'Mapbox'
  s.homepage       = 'https://docs.expo.dev/modules/'
  s.platforms      = {
    :ios => '16.4',
    :tvos => '16.4'
  }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'
  s.dependency 'MapboxVendor'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
