package expo.modules.navigationmodule

import com.mapbox.api.directions.v5.DirectionsCriteria
import expo.modules.kotlin.types.Enumerable

enum class NavigationMode(val value: String) : Enumerable {
  driving("driving"),
  walking("walking"),
  cycling("cycling"),
  drivingTraffic("driving-traffic"),
}

val NavigationMode.directionsProfile: String
  get() = when (this) {
    NavigationMode.driving -> DirectionsCriteria.PROFILE_DRIVING
    NavigationMode.drivingTraffic -> DirectionsCriteria.PROFILE_DRIVING_TRAFFIC
    NavigationMode.walking -> DirectionsCriteria.PROFILE_WALKING
    NavigationMode.cycling -> DirectionsCriteria.PROFILE_CYCLING
  }
