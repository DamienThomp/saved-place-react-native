Pod::Spec.new do |s|
  s.name             = 'MapboxVendor'
  s.version          = '1.0.0'
  s.summary          = 'Vendored Mapbox Maps + Navigation XCFrameworks (single link owner)'
  s.description      = 'Prebuilt Mapbox XCFrameworks shared by rnmapbox-maps and NavigationModule.'
  s.homepage         = 'https://docs.expo.dev/modules/'
  s.license          = { :type => 'Proprietary' }
  s.author           = { 'saved-place' => 'dev@local' }
  s.platform         = :ios, '16.4'
  s.source           = { :git => 'https://example.com/placeholder.git', :tag => s.version.to_s }
  s.static_framework = true

  frameworks = Dir.glob(File.join(__dir__, 'Frameworks', '*.xcframework'))
  if frameworks.empty?
    Pod::UI.puts "\n[MapboxVendor] ERROR: No XCFrameworks found in #{File.join(__dir__, 'Frameworks')}"
    Pod::UI.puts '[MapboxVendor] Run: npm run mapbox:build-xcframeworks\n'
    raise '[MapboxVendor] Missing vendored Mapbox XCFrameworks — run scripts/build-mapbox-xcframeworks.sh first'
  end

  s.vendored_frameworks = frameworks.map { |path| "Frameworks/#{File.basename(path)}" }
  s.preserve_paths = 'Frameworks/*.xcframework'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'FRAMEWORK_SEARCH_PATHS' => '$(inherited) "$(PODS_TARGET_SRCROOT)/Frameworks"',
    'OTHER_LDFLAGS' => '$(inherited) -ObjC',
  }
end
