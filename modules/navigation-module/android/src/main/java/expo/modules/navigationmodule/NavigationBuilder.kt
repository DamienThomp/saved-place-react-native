package expo.modules.navigationmodule

import android.content.Context
import expo.modules.navigationmodule.ui.NavigationExperienceHost

interface NavigationBuilderProtocol {
  fun build(context: Context, session: PreparedNavigationSession): NavigationExperienceHost
}

class NavigationBuilder : NavigationBuilderProtocol {
  override fun build(context: Context, session: PreparedNavigationSession): NavigationExperienceHost {
    return NavigationExperienceHost(context).apply {
      bind(session)
    }
  }
}
