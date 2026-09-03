package expo.modules.navigationmodule

import android.content.Context
import android.graphics.Color
import android.view.Gravity
import android.widget.LinearLayout
import android.widget.TextView
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView

class NavigationModuleView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  val onArrived by EventDispatcher()
  val onCancel by EventDispatcher()

  var origin: CoordinatesRecord? = null
  var destination: CoordinatesRecord? = null
  var mode: NavigationMode = NavigationMode.driving

  private val label = TextView(context)

  init {
    val container = LinearLayout(context).apply {
      layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
      orientation = LinearLayout.VERTICAL
      gravity = Gravity.CENTER
      setBackgroundColor(Color.parseColor("#aabbcc"))
    }

    label.apply {
      gravity = Gravity.CENTER
    }

    container.addView(label)
    addView(container)
  }

  fun configureNavigation() {
    val start = origin ?: return
    val end = destination ?: return

    label.text = """
      NavigationModule - native view
      Mode: ${mode.value}
      Origin: ${start.latitude}, ${start.longitude}
      Destination: ${end.latitude}, ${end.longitude}
      """.trimIndent()
  }

  fun handleArrival() {
    onArrived(
      mapOf(
        "latitude" to (destination?.latitude ?: 0.0),
        "longitude" to (destination?.longitude ?: 0.0),
      )
    )
  }

  fun handleCancel(reason: String = "user") {
    onCancel(
      mapOf(
        "reason" to reason,
      )
    )
  }
}
