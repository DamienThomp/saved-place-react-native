package expo.modules.navigationmodule

import android.content.Context
import com.mapbox.common.MapboxOptions
import com.mapbox.geojson.Point
import com.mapbox.navigation.base.ExperimentalPreviewMapboxNavigationAPI
import com.mapbox.navigation.base.extensions.applyDefaultNavigationOptions
import com.mapbox.navigation.base.extensions.applyLanguageAndVoiceUnitOptions
import com.mapbox.navigation.base.options.NavigationOptions
import com.mapbox.navigation.base.route.NavigationRoute
import com.mapbox.navigation.base.route.NavigationRouterCallback
import com.mapbox.navigation.base.route.RouterFailure
import com.mapbox.navigation.core.MapboxNavigation
import com.mapbox.navigation.core.MapboxNavigationProvider
import com.mapbox.api.directions.v5.models.RouteOptions
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException
import kotlinx.coroutines.suspendCancellableCoroutine

interface NavigationServiceProtocol {
  suspend fun prepareNavigationSession(
    origin: Point,
    destination: Point,
    profile: String,
    simulateRoute: Boolean = false,
  ): PreparedNavigationSession

  fun resetNavigationSession()
}

@OptIn(ExperimentalPreviewMapboxNavigationAPI::class)
class NavigationService(
  private val context: Context,
) : NavigationServiceProtocol {

  override suspend fun prepareNavigationSession(
    origin: Point,
    destination: Point,
    profile: String,
    simulateRoute: Boolean,
  ): PreparedNavigationSession {
    ensureAccessToken()

    val mapboxNavigation = ensureNavigation()

    val routes = requestRoutes(
      mapboxNavigation = mapboxNavigation,
      origin = origin,
      destination = destination,
      profile = profile,
    )

    mapboxNavigation.setNavigationRoutes(routes)

    if (simulateRoute) {
      mapboxNavigation.startReplayTripSession()
    } else {
      mapboxNavigation.startTripSession()
    }

    return PreparedNavigationSession(
      routes = routes,
      mapboxNavigation = mapboxNavigation,
    )
  }

  override fun resetNavigationSession() {
    if (!MapboxNavigationProvider.isCreated()) {
      return
    }

    val mapboxNavigation = MapboxNavigationProvider.retrieve()
    mapboxNavigation.setNavigationRoutes(emptyList())
    MapboxNavigationProvider.destroy()
  }

  private fun ensureAccessToken() {
    if (MapboxOptions.accessToken.isNullOrEmpty()) {
      throw IllegalStateException("Mapbox access token is not configured")
    }
  }

  private fun ensureNavigation(): MapboxNavigation {
    if (!MapboxNavigationProvider.isCreated()) {
      MapboxNavigationProvider.create(
        NavigationOptions.Builder(context.applicationContext).build(),
      )
    }
    return MapboxNavigationProvider.retrieve()
  }

  private suspend fun requestRoutes(
    mapboxNavigation: MapboxNavigation,
    origin: Point,
    destination: Point,
    profile: String,
  ): List<NavigationRoute> = suspendCancellableCoroutine { continuation ->
    val routeOptions = RouteOptions.builder()
      .applyDefaultNavigationOptions()
      .applyLanguageAndVoiceUnitOptions(context)
      .coordinatesList(listOf(origin, destination))
      .profile(profile)
      .build()

    val requestId = mapboxNavigation.requestRoutes(
      routeOptions,
      object : NavigationRouterCallback {
        override fun onRoutesReady(
          routes: List<NavigationRoute>,
          routerOrigin: String,
        ) {
          if (routes.isEmpty()) {
            continuation.resumeWithException(IllegalStateException("No routes returned"))
          } else {
            continuation.resume(routes)
          }
        }

        override fun onFailure(
          reasons: List<RouterFailure>,
          routeOptions: RouteOptions,
        ) {
          val message = reasons.firstOrNull()?.message ?: "Route request failed"
          continuation.resumeWithException(IllegalStateException(message))
        }

        override fun onCanceled(routeOptions: RouteOptions, routerOrigin: String) {
          continuation.resumeWithException(IllegalStateException("Route request canceled"))
        }
      },
    )

    continuation.invokeOnCancellation {
      mapboxNavigation.cancelRouteRequest(requestId)
    }
  }
}
