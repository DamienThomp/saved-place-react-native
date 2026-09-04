package expo.modules.navigationmodule

import android.content.Context
import android.graphics.Color
import android.view.Gravity
import android.view.View
import android.view.View.MeasureSpec
import android.widget.FrameLayout
import android.widget.ProgressBar
import android.widget.TextView
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ExpoView
import expo.modules.navigationmodule.ui.NavigationExperienceHost

class NavigationModuleView(context: Context, appContext: AppContext) :
  ExpoView(context, appContext),
  NavigationModuleViewProtocol {

  val onArrived by EventDispatcher()
  val onCancel by EventDispatcher()

  var origin: CoordinatesRecord? = null
  var destination: CoordinatesRecord? = null
  var mode: NavigationMode = NavigationMode.driving

  private val presenter: NavigationPresenterProtocol by lazy {
    NavigationPresenterFactory.makePresenter(view = this, context = context)
  }

  private val root = FrameLayout(context)
  private val hostContainer = FrameLayout(context)
  private val progressBar = ProgressBar(context)
  private val errorLabel = TextView(context)

  private var embeddedHost: NavigationExperienceHost? = null
  private var pendingHost: NavigationExperienceHost? = null

  init {
    setBackgroundColor(Color.BLACK)
    setupPlaceholderViews()
  }

  override fun onLayout(changed: Boolean, left: Int, top: Int, right: Int, bottom: Int) {
    super.onLayout(changed, left, top, right, bottom)

    if (width <= 0 || height <= 0) {
      return
    }

    if (pendingHost != null) {
      val host = pendingHost
      pendingHost = null
      if (host != null) {
        embed(host)
      }
      return
    }

    embeddedHost?.let { relayoutEmbeddedHost(it) }
  }

  override fun onDetachedFromWindow() {
    super.onDetachedFromWindow()
    presenter.teardown()
  }

  fun configureNavigation() {
    val start = origin ?: return
    val end = destination ?: return
    presenter.configure(origin = start, destination = end, mode = mode)
  }

  override fun render(state: ViewState<NavigationExperienceHost>) {
    when (state) {
      ViewState.Idle -> {
        removeEmbedded()
        progressBar.visibility = View.GONE
        errorLabel.visibility = View.GONE
      }

      ViewState.Loading -> {
        removeEmbedded()
        errorLabel.visibility = View.GONE
        progressBar.visibility = View.VISIBLE
      }

      is ViewState.Success -> {
        progressBar.visibility = View.GONE
        errorLabel.visibility = View.GONE
        embed(state.value)
      }

      is ViewState.Error -> {
        removeEmbedded()
        progressBar.visibility = View.GONE
        errorLabel.text = state.message
        errorLabel.visibility = View.VISIBLE
      }
    }
  }

  override fun handleArrival(latitude: Double, longitude: Double) {
    onArrived(
      mapOf(
        "latitude" to latitude,
        "longitude" to longitude,
      ),
    )
  }

  override fun handleCancel(reason: String) {
    onCancel(
      mapOf(
        "reason" to reason,
      ),
    )
  }

  private fun setupPlaceholderViews() {
    addView(
      root,
      LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT),
    )

    hostContainer.layoutParams = FrameLayout.LayoutParams(
      FrameLayout.LayoutParams.MATCH_PARENT,
      FrameLayout.LayoutParams.MATCH_PARENT,
    )

    progressBar.visibility = View.GONE
    progressBar.layoutParams = FrameLayout.LayoutParams(
      FrameLayout.LayoutParams.WRAP_CONTENT,
      FrameLayout.LayoutParams.WRAP_CONTENT,
      Gravity.CENTER,
    )

    errorLabel.apply {
      visibility = View.GONE
      gravity = Gravity.CENTER
      setTextColor(Color.WHITE)
      textAlignment = View.TEXT_ALIGNMENT_CENTER
    }
    errorLabel.layoutParams = FrameLayout.LayoutParams(
      FrameLayout.LayoutParams.MATCH_PARENT,
      FrameLayout.LayoutParams.WRAP_CONTENT,
      Gravity.CENTER,
    ).apply {
      val horizontalPadding = (16 * resources.displayMetrics.density).toInt()
      marginStart = horizontalPadding
      marginEnd = horizontalPadding
    }

    root.addView(hostContainer)
    root.addView(progressBar)
    root.addView(errorLabel)
  }

  private fun embed(host: NavigationExperienceHost) {
    if (embeddedHost === host) {
      return
    }

    removeEmbedded()

    if (width <= 0 || height <= 0) {
      pendingHost = host
      return
    }

    hostContainer.addView(
      host,
      FrameLayout.LayoutParams(
        FrameLayout.LayoutParams.MATCH_PARENT,
        FrameLayout.LayoutParams.MATCH_PARENT,
      ),
    )
    embeddedHost = host
    relayoutEmbeddedHost(host)
  }

  private fun removeEmbedded() {
    pendingHost = null

    embeddedHost?.let { host ->
      hostContainer.removeView(host)
    }
    embeddedHost = null
  }

  private fun relayoutEmbeddedHost(host: NavigationExperienceHost) {
    if (width <= 0 || height <= 0) {
      return
    }

    host.requestLayout()
    host.forceLayout()
    host.measure(
      MeasureSpec.makeMeasureSpec(width, MeasureSpec.EXACTLY),
      MeasureSpec.makeMeasureSpec(height, MeasureSpec.EXACTLY),
    )
    host.layout(0, 0, width, height)
  }
}
