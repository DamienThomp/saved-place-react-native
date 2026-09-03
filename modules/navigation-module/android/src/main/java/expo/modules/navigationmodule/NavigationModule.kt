package expo.modules.navigationmodule

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.types.Enumerable

class CoordinatesRecord : Record {
  @Field
  val latitude: Double = 0.0

  @Field
  val longitude: Double = 0.0
}

enum class NavigationMode(val value: String) : Enumerable {
  driving("driving"),
  walking("walking"),
  cycling("cycling"),
  drivingTraffic("driving-traffic")
}

class NavigationModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("NavigationModule")

    View(NavigationModuleView::class) {
      Events("onArrived", "onCancel")

      Prop("origin") { view: NavigationModuleView, origin: CoordinatesRecord ->
        view.origin = origin
      }

      Prop("destination") { view: NavigationModuleView, destination: CoordinatesRecord ->
        view.destination = destination
      }

      Prop("mode") { view: NavigationModuleView, mode: NavigationMode ->
        view.mode = mode
      }

      OnViewDidUpdateProps { view ->
        view.configureNavigation()
      }
    }
  }
}
