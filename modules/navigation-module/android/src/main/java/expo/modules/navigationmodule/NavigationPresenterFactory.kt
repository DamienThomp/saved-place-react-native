package expo.modules.navigationmodule

import android.content.Context

object NavigationPresenterFactory {
  fun makePresenter(
    view: NavigationModuleViewProtocol,
    context: Context,
    service: NavigationServiceProtocol? = null,
    builder: NavigationBuilderProtocol? = null,
  ): NavigationPresenterProtocol {
    val appContext = context.applicationContext
    return NavigationPresenter(
      view = view,
      context = appContext,
      service = service ?: NavigationService(appContext),
      builder = builder ?: NavigationBuilder(),
    )
  }
}
