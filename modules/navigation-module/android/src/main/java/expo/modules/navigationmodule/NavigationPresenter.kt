package expo.modules.navigationmodule

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import androidx.core.content.ContextCompat
import com.mapbox.geojson.Point
import expo.modules.navigationmodule.ui.NavigationExperienceHost
import java.lang.ref.WeakReference
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch

interface NavigationModuleViewProtocol {
  fun render(state: ViewState<NavigationExperienceHost>)
  fun handleArrival(latitude: Double, longitude: Double)
  fun handleCancel(reason: String)
}

interface NavigationPresenterProtocol {
  fun configure(origin: CoordinatesRecord, destination: CoordinatesRecord, mode: NavigationMode)
  fun teardown()
}

private data class NavigationRequest(
  val origin: CoordinatesRecord,
  val destination: CoordinatesRecord,
  val mode: NavigationMode,
)

class NavigationPresenter(
  view: NavigationModuleViewProtocol,
  private val context: Context,
  private val service: NavigationServiceProtocol,
  private val builder: NavigationBuilderProtocol,
) : NavigationPresenterProtocol {

  private val viewRef = WeakReference(view)
  private val presenterScope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)

  private var navigationHost: NavigationExperienceHost? = null
  private var currentRequest: NavigationRequest? = null
  private var buildJob: Job? = null

  override fun configure(
    origin: CoordinatesRecord,
    destination: CoordinatesRecord,
    mode: NavigationMode,
  ) {
    val request = NavigationRequest(origin, destination, mode)
    if (request == currentRequest) {
      return
    }
    currentRequest = request

    buildJob?.cancel()
    navigationHost?.unbind()
    navigationHost = null
    viewRef.get()?.render(ViewState.Loading)

    buildJob = presenterScope.launch {
      if (!hasLocationPermission()) {
        viewRef.get()?.render(ViewState.Error("Location permission required"))
        return@launch
      }

      try {
        val session = service.prepareNavigationSession(
          origin = origin.toPoint(),
          destination = destination.toPoint(),
          profile = mode.directionsProfile,
          simulateRoute = false,
        )

        if (!isActive) {
          return@launch
        }

        val host = builder.build(context, session).apply {
          onArrived = { _, _ ->
            viewRef.get()?.handleArrival(destination.latitude, destination.longitude)
          }
          onCancel = { reason ->
            viewRef.get()?.handleCancel(reason)
            teardown()
          }
        }

        navigationHost = host
        viewRef.get()?.render(ViewState.Success(host))
      } catch (error: Throwable) {
        if (!isActive) {
          return@launch
        }
        viewRef.get()?.render(ViewState.Error(error.message ?: "Navigation failed"))
      }
    }
  }

  override fun teardown() {
    buildJob?.cancel()
    buildJob = null

    navigationHost?.unbind()
    navigationHost = null

    viewRef.get()?.render(ViewState.Idle)
    currentRequest = null

    service.resetNavigationSession()
    presenterScope.cancel()
  }

  private fun hasLocationPermission(): Boolean {
    return ContextCompat.checkSelfPermission(
      context,
      Manifest.permission.ACCESS_FINE_LOCATION,
    ) == PackageManager.PERMISSION_GRANTED
  }
}

private fun CoordinatesRecord.toPoint(): Point =
  Point.fromLngLat(longitude, latitude)
