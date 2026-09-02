import ExpoModulesCore

struct CoordinatesRecord: Record {
  @Field var latitude: Double = 0
  @Field var longitude: Double = 0
}

enum NavigationMode: String, Enumerable {
  case driving
  case walking
  case cycling
  case drivingTraffic = "driving-traffic"
}

public class NavigationModule: Module {
  public func definition() -> ModuleDefinition {
    Name("NavigationModule")

    View(NavigationModuleView.self) {
      Events("onArrived", "onCancel")

      Prop("origin") { (view: NavigationModuleView, origin: CoordinatesRecord) in
        view.origin = origin
      }

      Prop("destination") { (view: NavigationModuleView, destination: CoordinatesRecord) in
        view.destination = destination
      }

      Prop("mode") { (view: NavigationModuleView, mode: NavigationMode) in
        view.mode = mode
      }

      OnViewDidUpdateProps { view in
        view.configureNavigation()
      }
    }
  }
}
