//
//  NavigationPresenter.swift
//  
//
//  Created by Damien L Thompson on 2026-09-02.
//
import CoreLocation
import MapboxDirections
import MapboxNavigationUIKit

@MainActor
protocol NavigationModuleViewProtocol: AnyObject {
    func render(_ state: ViewState<NavigationViewController>)
    func handleArrival(latitude: Double, longitude: Double)
    func handleCancel(reason: String)
}

@MainActor
protocol NavigationPresenterProtocol: AnyObject {
    func configure(origin: CoordinatesRecord, destination: CoordinatesRecord, mode: NavigationMode)
    func teardown()
}

/// Dedupes redundant `configure` calls — Expo re-invokes
/// `OnViewDidUpdateProps` on every prop diff, not just on real changes.
private struct NavigationRequest: Equatable {
    let origin: CoordinatesRecord
    let destination: CoordinatesRecord
    let mode: NavigationMode

    static func == (lhs: Self, rhs: Self) -> Bool {
        lhs.origin.latitude == rhs.origin.latitude &&
        lhs.origin.longitude == rhs.origin.longitude &&
        lhs.destination.latitude == rhs.destination.latitude &&
        lhs.destination.longitude == rhs.destination.longitude &&
        lhs.mode.rawValue == rhs.mode.rawValue
    }
}

@MainActor
final class NavigationPresenter: NSObject, NavigationPresenterProtocol {

    private weak var view: NavigationModuleViewProtocol?
    private let service: NavigationServiceProtocol
    private let builder: NavigationBuilderProtocol

    private var navigationViewController: NavigationViewController?
    private var currentRequest: NavigationRequest?
    private var buildTask: Task<Void, Never>?

    init(
        view: NavigationModuleViewProtocol,
        service: NavigationServiceProtocol,
        builder: NavigationBuilderProtocol
    ) {
        self.view = view
        self.service = service
        self.builder = builder
    }

    func configure(origin: CoordinatesRecord, destination: CoordinatesRecord, mode: NavigationMode) {
        let request = NavigationRequest(origin: origin, destination: destination, mode: mode)
        guard request != currentRequest else { return }
        currentRequest = request

        buildTask?.cancel()
        view?.render(.loading)

        buildTask = Task {
            do {
                let session = try await service.prepareNavigationSession(
                    origin: origin.coordinate,
                    destination: destination.coordinate,
                    profileIdentifier: mode.profileIdentifier,
                    simulateRoute: false
                )
                guard !Task.isCancelled else { return }

                let viewController = builder.buildViewController(from: session)
                viewController.delegate = self

                navigationViewController = viewController
                view?.render(.success(viewController))
            } catch {
                guard !Task.isCancelled else { return }
                view?.render(.error(message: error.localizedDescription))
            }
        }
    }

    func teardown() {
        buildTask?.cancel()

        if let viewController = navigationViewController {
            viewController.delegate = nil
            viewController.navigationMapView?.removeRoutes()
            viewController.navigationMapView?.navigationCamera.stop()
            navigationViewController = nil
        }

        view?.render(.idle)
        currentRequest = nil

        service.resetNavigationSession()
    }
}

// MARK: - NavigationViewControllerDelegate
extension NavigationPresenter: NavigationViewControllerDelegate {
    func navigationViewControllerDidDismiss(
        _ navigationViewController: NavigationViewController,
        byCanceling canceled: Bool
    ) {
        view?.handleCancel(reason: canceled ? "user" : "system")
        teardown()
    }

    func navigationViewController(
        _ navigationViewController: NavigationViewController,
        didArriveAt waypoint: Waypoint
    ) {
        view?.handleArrival(
            latitude: waypoint.coordinate.latitude,
            longitude: waypoint.coordinate.longitude
        )
    }
}

extension CoordinatesRecord {
    fileprivate var coordinate: CLLocationCoordinate2D {
        CLLocationCoordinate2D(latitude: latitude, longitude: longitude)
    }
}
