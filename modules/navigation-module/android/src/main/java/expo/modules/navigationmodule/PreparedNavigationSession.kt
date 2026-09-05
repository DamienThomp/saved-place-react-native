package expo.modules.navigationmodule

import com.mapbox.navigation.base.route.NavigationRoute
import com.mapbox.navigation.core.MapboxNavigation
import java.util.UUID

data class PreparedNavigationSession(
  val id: UUID = UUID.randomUUID(),
  val routes: List<NavigationRoute>,
  val mapboxNavigation: MapboxNavigation,
)
