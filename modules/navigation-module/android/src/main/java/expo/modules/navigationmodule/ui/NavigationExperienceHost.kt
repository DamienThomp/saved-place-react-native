package expo.modules.navigationmodule.ui

import android.content.Context
import android.content.res.Configuration
import android.content.res.Resources
import android.util.AttributeSet
import android.view.Gravity
import android.view.View
import android.widget.FrameLayout
import android.widget.ImageView
import com.mapbox.bindgen.Expected
import com.mapbox.common.location.Location
import com.mapbox.maps.EdgeInsets
import com.mapbox.maps.ImageHolder
import com.mapbox.maps.MapView
import com.mapbox.maps.plugin.animation.camera
import com.mapbox.maps.plugin.gestures.gestures
import com.mapbox.maps.plugin.LocationPuck2D
import com.mapbox.maps.plugin.locationcomponent.location
import com.mapbox.navigation.base.ExperimentalPreviewMapboxNavigationAPI
import com.mapbox.navigation.base.TimeFormat
import com.mapbox.navigation.base.formatter.DistanceFormatterOptions
import com.mapbox.navigation.base.trip.model.RouteLegProgress
import com.mapbox.navigation.base.trip.model.RouteProgress
import com.mapbox.navigation.core.MapboxNavigation
import com.mapbox.navigation.core.arrival.ArrivalObserver
import com.mapbox.navigation.core.directions.session.RoutesObserver
import com.mapbox.navigation.core.formatter.MapboxDistanceFormatter
import com.mapbox.navigation.core.trip.session.LocationMatcherResult
import com.mapbox.navigation.core.trip.session.LocationObserver
import com.mapbox.navigation.core.trip.session.RouteProgressObserver
import com.mapbox.navigation.core.trip.session.VoiceInstructionsObserver
import com.mapbox.navigation.tripdata.maneuver.api.MapboxManeuverApi
import com.mapbox.navigation.tripdata.progress.api.MapboxTripProgressApi
import com.mapbox.navigation.tripdata.progress.model.DistanceRemainingFormatter
import com.mapbox.navigation.tripdata.progress.model.EstimatedTimeToArrivalFormatter
import com.mapbox.navigation.tripdata.progress.model.PercentDistanceTraveledFormatter
import com.mapbox.navigation.tripdata.progress.model.TimeRemainingFormatter
import com.mapbox.navigation.tripdata.progress.model.TripProgressUpdateFormatter
import com.mapbox.navigation.ui.base.util.MapboxNavigationConsumer
import com.mapbox.navigation.ui.components.R as NavigationUiR
import com.mapbox.navigation.ui.components.maneuver.view.MapboxManeuverView
import com.mapbox.navigation.ui.components.maps.camera.view.MapboxRecenterButton
import com.mapbox.navigation.ui.components.maps.camera.view.MapboxRouteOverviewButton
import com.mapbox.navigation.ui.components.tripprogress.view.MapboxTripProgressView
import com.mapbox.navigation.ui.components.voice.view.MapboxSoundButton
import com.mapbox.navigation.ui.maps.NavigationStyles
import com.mapbox.navigation.ui.maps.camera.NavigationCamera
import com.mapbox.navigation.ui.maps.camera.data.MapboxNavigationViewportDataSource
import com.mapbox.navigation.ui.maps.camera.lifecycle.NavigationBasicGesturesHandler
import com.mapbox.navigation.ui.maps.camera.state.NavigationCameraState
import com.mapbox.navigation.ui.maps.camera.transition.NavigationCameraTransitionOptions
import com.mapbox.navigation.ui.maps.location.NavigationLocationProvider
import com.mapbox.navigation.ui.maps.route.arrow.api.MapboxRouteArrowApi
import com.mapbox.navigation.ui.maps.route.arrow.api.MapboxRouteArrowView
import com.mapbox.navigation.ui.maps.route.arrow.model.RouteArrowOptions
import com.mapbox.navigation.ui.maps.route.line.api.MapboxRouteLineApi
import com.mapbox.navigation.ui.maps.route.line.api.MapboxRouteLineView
import com.mapbox.navigation.ui.maps.route.line.model.MapboxRouteLineApiOptions
import com.mapbox.navigation.ui.maps.route.line.model.MapboxRouteLineViewOptions
import com.mapbox.navigation.voice.api.MapboxSpeechApi
import com.mapbox.navigation.voice.api.MapboxVoiceInstructionsPlayer
import com.mapbox.navigation.voice.model.SpeechAnnouncement
import com.mapbox.navigation.voice.model.SpeechError
import com.mapbox.navigation.voice.model.SpeechValue
import com.mapbox.navigation.voice.model.SpeechVolume
import expo.modules.navigationmodule.PreparedNavigationSession
import java.util.Locale

@OptIn(ExperimentalPreviewMapboxNavigationAPI::class)
class NavigationExperienceHost @JvmOverloads constructor(
  context: Context,
  attrs: AttributeSet? = null,
) : FrameLayout(context, attrs) {

  private companion object {
    const val BUTTON_ANIMATION_DURATION = 1500L
  }

  var onCancel: ((reason: String) -> Unit)? = null
  var onArrived: ((latitude: Double, longitude: Double) -> Unit)? = null

  private val mapView = MapView(context)
  private val maneuverView = MapboxManeuverView(context)
  private val tripProgressView = MapboxTripProgressView(context)
  private val stopButton = ImageView(context)
  private val soundButton = MapboxSoundButton(context)
  private val routeOverviewButton = MapboxRouteOverviewButton(context)
  private val recenterButton = MapboxRecenterButton(context)
  private val tripProgressContainer = FrameLayout(context)

  private lateinit var navigationCamera: NavigationCamera
  private lateinit var viewportDataSource: MapboxNavigationViewportDataSource
  private lateinit var maneuverApi: MapboxManeuverApi
  private lateinit var tripProgressApi: MapboxTripProgressApi
  private lateinit var routeLineApi: MapboxRouteLineApi
  private lateinit var routeLineView: MapboxRouteLineView
  private lateinit var routeArrowView: MapboxRouteArrowView
  private lateinit var speechApi: MapboxSpeechApi
  private lateinit var voiceInstructionsPlayer: MapboxVoiceInstructionsPlayer

  private val routeArrowApi = MapboxRouteArrowApi()
  private val navigationLocationProvider = NavigationLocationProvider()
  private var firstLocationUpdateReceived = false

  private var mapboxNavigation: MapboxNavigation? = null
  private var isBound = false
  private var isVoiceInstructionsMuted = false
    set(value) {
      field = value
      if (value) {
        soundButton.muteAndExtend(BUTTON_ANIMATION_DURATION)
        voiceInstructionsPlayer.volume(SpeechVolume(0f))
      } else {
        soundButton.unmuteAndExtend(BUTTON_ANIMATION_DURATION)
        voiceInstructionsPlayer.volume(SpeechVolume(1f))
      }
    }

  private val pixelDensity = Resources.getSystem().displayMetrics.density
  private val overviewPadding: EdgeInsets by lazy {
    EdgeInsets(
      140.0 * pixelDensity,
      40.0 * pixelDensity,
      120.0 * pixelDensity,
      40.0 * pixelDensity,
    )
  }
  private val landscapeOverviewPadding: EdgeInsets by lazy {
    EdgeInsets(
      30.0 * pixelDensity,
      380.0 * pixelDensity,
      110.0 * pixelDensity,
      20.0 * pixelDensity,
    )
  }
  private val followingPadding: EdgeInsets by lazy {
    EdgeInsets(
      180.0 * pixelDensity,
      40.0 * pixelDensity,
      150.0 * pixelDensity,
      40.0 * pixelDensity,
    )
  }
  private val landscapeFollowingPadding: EdgeInsets by lazy {
    EdgeInsets(
      30.0 * pixelDensity,
      380.0 * pixelDensity,
      110.0 * pixelDensity,
      40.0 * pixelDensity,
    )
  }

  private val speechCallback =
    MapboxNavigationConsumer<Expected<SpeechError, SpeechValue>> { expected ->
      expected.fold(
        { error ->
          voiceInstructionsPlayer.play(error.fallback, voiceInstructionsPlayerCallback)
        },
        { value ->
          voiceInstructionsPlayer.play(value.announcement, voiceInstructionsPlayerCallback)
        },
      )
    }

  private val voiceInstructionsPlayerCallback =
    MapboxNavigationConsumer<SpeechAnnouncement> { value ->
      speechApi.clean(value)
    }

  private val voiceInstructionsObserver = VoiceInstructionsObserver { voiceInstructions ->
    speechApi.generate(voiceInstructions, speechCallback)
  }

  private val locationObserver = object : LocationObserver {
    override fun onNewRawLocation(rawLocation: Location) = Unit

    override fun onNewLocationMatcherResult(locationMatcherResult: LocationMatcherResult) {
      val enhancedLocation = locationMatcherResult.enhancedLocation
      navigationLocationProvider.changePosition(
        location = enhancedLocation,
        keyPoints = locationMatcherResult.keyPoints,
      )

      viewportDataSource.onLocationChanged(enhancedLocation)
      viewportDataSource.evaluate()

      if (!firstLocationUpdateReceived) {
        firstLocationUpdateReceived = true
        navigationCamera.requestNavigationCameraToOverview(
          stateTransitionOptions = NavigationCameraTransitionOptions.Builder()
            .maxDuration(0)
            .build(),
        )
      }
    }
  }

  private val routeProgressObserver = RouteProgressObserver { routeProgress ->
    viewportDataSource.onRouteProgressChanged(routeProgress)
    viewportDataSource.evaluate()

    val style = mapView.mapboxMap.style
    if (style != null) {
      val maneuverArrowResult = routeArrowApi.addUpcomingManeuverArrow(routeProgress)
      routeArrowView.renderManeuverUpdate(style, maneuverArrowResult)
    }

    val maneuvers = maneuverApi.getManeuvers(routeProgress)
    maneuvers.fold(
      { /* ignore maneuver errors in host */ },
      {
        maneuverView.visibility = View.VISIBLE
        maneuverView.renderManeuvers(maneuvers)
      },
    )

    tripProgressView.render(tripProgressApi.getTripProgress(routeProgress))
  }

  private val routesObserver = RoutesObserver { routeUpdateResult ->
    if (routeUpdateResult.navigationRoutes.isNotEmpty()) {
      routeLineApi.setNavigationRoutes(routeUpdateResult.navigationRoutes) { value ->
        mapView.mapboxMap.style?.apply {
          routeLineView.renderRouteDrawData(this, value)
        }
      }

      viewportDataSource.onRouteChanged(routeUpdateResult.navigationRoutes.first())
      viewportDataSource.evaluate()
    } else {
      val style = mapView.mapboxMap.style
      if (style != null) {
        routeLineApi.clearRouteLine { value ->
          routeLineView.renderClearRouteLineValue(style, value)
        }
        routeArrowView.render(style, routeArrowApi.clearArrows())
      }

      viewportDataSource.clearRouteData()
      viewportDataSource.evaluate()
    }
  }

  private val arrivalObserver = object : ArrivalObserver {
    override fun onWaypointArrival(routeProgress: RouteProgress) = Unit

    override fun onNextRouteLegStart(routeLegProgress: RouteLegProgress) = Unit

    override fun onFinalDestinationArrival(routeProgress: RouteProgress) {
      onArrived?.invoke(0.0, 0.0)
    }
  }

  init {
    setupLayout()
    setupNavigationComponents()
    setupInteractions()
  }

  fun bind(session: PreparedNavigationSession) {
    if (isBound) {
      return
    }

    val navigation = session.mapboxNavigation
    mapboxNavigation = navigation
    isBound = true

    navigation.registerRoutesObserver(routesObserver)
    navigation.registerLocationObserver(locationObserver)
    navigation.registerRouteProgressObserver(routeProgressObserver)
    navigation.registerVoiceInstructionsObserver(voiceInstructionsObserver)
    navigation.registerArrivalObserver(arrivalObserver)

    mapView.mapboxMap.loadStyle(NavigationStyles.NAVIGATION_DAY_STYLE) { style ->
      routeLineView.initializeLayers(style)

      routeUpdateResultFromSession(session)?.let { routes ->
        routeLineApi.setNavigationRoutes(routes) { value ->
          routeLineView.renderRouteDrawData(style, value)
        }
        viewportDataSource.onRouteChanged(routes.first())
        viewportDataSource.evaluate()
      }

      showNavigationControls()
      navigationCamera.requestNavigationCameraToOverview()
    }
  }

  fun unbind() {
    if (!isBound) {
      return
    }

    val navigation = mapboxNavigation
    if (navigation != null) {
      navigation.unregisterRoutesObserver(routesObserver)
      navigation.unregisterLocationObserver(locationObserver)
      navigation.unregisterRouteProgressObserver(routeProgressObserver)
      navigation.unregisterVoiceInstructionsObserver(voiceInstructionsObserver)
      navigation.unregisterArrivalObserver(arrivalObserver)
    }

    maneuverApi.cancel()
    routeLineApi.cancel()
    routeLineView.cancel()
    speechApi.cancel()
    voiceInstructionsPlayer.shutdown()

    mapboxNavigation = null
    isBound = false
    hideNavigationControls()
    firstLocationUpdateReceived = false
  }

  private fun setupLayout() {
    addView(mapView, LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT))

    maneuverView.visibility = View.GONE
    addView(
      maneuverView,
      LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT).apply {
        gravity = Gravity.TOP
        topMargin = (4 * pixelDensity).toInt()
        marginStart = (4 * pixelDensity).toInt()
        marginEnd = (4 * pixelDensity).toInt()
      },
    )

    val buttonMargin = (16 * pixelDensity).toInt()
    val buttonTopMargin = (8 * pixelDensity).toInt()

    soundButton.visibility = View.GONE
    addView(
      soundButton,
      LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT).apply {
        gravity = Gravity.TOP or Gravity.END
        topMargin = buttonTopMargin
        marginEnd = buttonMargin
      },
    )

    routeOverviewButton.visibility = View.GONE
    addView(
      routeOverviewButton,
      LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT).apply {
        gravity = Gravity.TOP or Gravity.END
        topMargin = (56 * pixelDensity).toInt()
        marginEnd = buttonMargin
      },
    )

    recenterButton.visibility = View.GONE
    addView(
      recenterButton,
      LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT).apply {
        gravity = Gravity.TOP or Gravity.END
        topMargin = (104 * pixelDensity).toInt()
        marginEnd = buttonMargin
      },
    )

    tripProgressContainer.visibility = View.GONE
    tripProgressContainer.setBackgroundColor(0xFFFFFFFF.toInt())
    tripProgressContainer.elevation = 8f * pixelDensity

    tripProgressView.layoutParams = LayoutParams(
      LayoutParams.MATCH_PARENT,
      LayoutParams.WRAP_CONTENT,
    )
    tripProgressContainer.addView(tripProgressView)

    stopButton.setImageResource(android.R.drawable.ic_delete)
    stopButton.layoutParams = LayoutParams(
      (48 * pixelDensity).toInt(),
      (48 * pixelDensity).toInt(),
      Gravity.END or Gravity.CENTER_VERTICAL,
    ).apply {
      marginEnd = (12 * pixelDensity).toInt()
    }
    tripProgressContainer.addView(stopButton)

    addView(
      tripProgressContainer,
      LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT).apply {
        gravity = Gravity.BOTTOM
      },
    )
  }

  private fun setupNavigationComponents() {
    viewportDataSource = MapboxNavigationViewportDataSource(mapView.mapboxMap)
    navigationCamera = NavigationCamera(
      mapView.mapboxMap,
      mapView.camera,
      viewportDataSource,
    )

    mapView.camera.addCameraAnimationsLifecycleListener(
      NavigationBasicGesturesHandler(navigationCamera),
    )

    navigationCamera.registerNavigationCameraStateChangeObserver { navigationCameraState ->
      when (navigationCameraState) {
        NavigationCameraState.TRANSITION_TO_FOLLOWING,
        NavigationCameraState.FOLLOWING -> recenterButton.visibility = View.GONE

        NavigationCameraState.TRANSITION_TO_OVERVIEW,
        NavigationCameraState.OVERVIEW,
        NavigationCameraState.IDLE -> recenterButton.visibility = View.VISIBLE
      }
    }

    applyViewportPadding()

    val distanceFormatterOptions = DistanceFormatterOptions.Builder(context).build()

    maneuverApi = MapboxManeuverApi(MapboxDistanceFormatter(distanceFormatterOptions))
    tripProgressApi = MapboxTripProgressApi(
      TripProgressUpdateFormatter.Builder(context)
        .distanceRemainingFormatter(DistanceRemainingFormatter(distanceFormatterOptions))
        .timeRemainingFormatter(TimeRemainingFormatter(context))
        .percentRouteTraveledFormatter(PercentDistanceTraveledFormatter())
        .estimatedTimeToArrivalFormatter(
          EstimatedTimeToArrivalFormatter(context, TimeFormat.NONE_SPECIFIED),
        )
        .build(),
    )

    speechApi = MapboxSpeechApi(context, Locale.getDefault().language)
    voiceInstructionsPlayer = MapboxVoiceInstructionsPlayer(context, Locale.getDefault().language)

    val routeLineViewOptions = MapboxRouteLineViewOptions.Builder(context)
      .routeLineBelowLayerId("road-label-navigation")
      .build()
    val routeLineApiOptions = MapboxRouteLineApiOptions.Builder()
      .vanishingRouteLineEnabled(true)
      .build()

    routeLineApi = MapboxRouteLineApi(routeLineApiOptions)
    routeLineView = MapboxRouteLineView(routeLineViewOptions)
    routeArrowView = MapboxRouteArrowView(RouteArrowOptions.Builder(context).build())

    mapView.location.apply {
      setLocationProvider(navigationLocationProvider)
      locationPuck = LocationPuck2D(
        bearingImage = ImageHolder.from(NavigationUiR.drawable.mapbox_navigation_puck_icon),
      )
      puckBearingEnabled = true
      enabled = true
    }
  }

  private fun setupInteractions() {
    stopButton.setOnClickListener {
      mapboxNavigation?.setNavigationRoutes(emptyList())
      onCancel?.invoke("user")
    }

    recenterButton.setOnClickListener {
      navigationCamera.requestNavigationCameraToFollowing()
      routeOverviewButton.showTextAndExtend(BUTTON_ANIMATION_DURATION)
    }

    routeOverviewButton.setOnClickListener {
      navigationCamera.requestNavigationCameraToOverview()
      recenterButton.showTextAndExtend(BUTTON_ANIMATION_DURATION)
    }

    soundButton.setOnClickListener {
      isVoiceInstructionsMuted = !isVoiceInstructionsMuted
    }

    soundButton.unmute()
  }

  private fun applyViewportPadding() {
    if (resources.configuration.orientation == Configuration.ORIENTATION_LANDSCAPE) {
      viewportDataSource.overviewPadding = landscapeOverviewPadding
      viewportDataSource.followingPadding = landscapeFollowingPadding
    } else {
      viewportDataSource.overviewPadding = overviewPadding
      viewportDataSource.followingPadding = followingPadding
    }
  }

  private fun showNavigationControls() {
    soundButton.visibility = View.VISIBLE
    routeOverviewButton.visibility = View.VISIBLE
    tripProgressContainer.visibility = View.VISIBLE
    recenterButton.visibility = View.VISIBLE
  }

  private fun hideNavigationControls() {
    soundButton.visibility = View.GONE
    maneuverView.visibility = View.GONE
    routeOverviewButton.visibility = View.GONE
    tripProgressContainer.visibility = View.GONE
    recenterButton.visibility = View.GONE
  }

  private fun routeUpdateResultFromSession(session: PreparedNavigationSession) =
    session.routes.takeIf { it.isNotEmpty() }
}
