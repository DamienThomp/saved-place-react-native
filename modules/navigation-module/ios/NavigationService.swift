//
//  NavigationService.swift
//  
//
//  Created by Damien L Thompson on 2026-09-02.
//

import CoreLocation
import MapboxNavigationCore
import MapboxDirections

enum NavigationServiceErrorType: Error {
    case noProvider
}

@MainActor
protocol NavigationServiceProtocol {
    func prepareNavigationSession(
        origin: CLLocationCoordinate2D,
        destination: CLLocationCoordinate2D,
        profileIdentifier: ProfileIdentifier,
        simulateRoute: Bool
    ) async throws -> PreparedNavigationSession

    func resetNavigationSession()
}

@MainActor
final class NavigationService: NavigationServiceProtocol {

    private var provider: MapboxNavigationProvider?
    private var isSimulating = false

    func resetNavigationSession() {
        guard let provider else { return }
        provider.tripSession().setToIdle()
        provider.routeVoiceController.speechSynthesizer.stopSpeaking()
        self.provider = nil
        isSimulating = false
    }

    func prepareNavigationSession(
        origin: CLLocationCoordinate2D,
        destination: CLLocationCoordinate2D,
        profileIdentifier: ProfileIdentifier = .automobileAvoidingTraffic,
        simulateRoute: Bool = false
    ) async throws -> PreparedNavigationSession {

        let provider = ensureProvider(simulateRoute: simulateRoute)

        let routes = try await calculateRoute(
            from: origin,
            to: destination,
            profileIdentifier: profileIdentifier,
            using: provider.mapboxNavigation
        )

        return .init(routes: routes, provider: provider)
    }

    private func ensureProvider(simulateRoute: Bool) -> MapboxNavigationProvider {
        let locationSource: LocationSource = simulateRoute ? .simulation() : .live

        if let provider {
            if simulateRoute != isSimulating {
                provider.apply(coreConfig: .init(locationSource: locationSource))
                isSimulating = simulateRoute
            }
            return provider
        }

        let provider = MapboxNavigationProvider(coreConfig: .init(locationSource: locationSource))
        self.provider = provider
        isSimulating = simulateRoute
        return provider
    }

    private func calculateRoute(
        from origin: CLLocationCoordinate2D,
        to destination: CLLocationCoordinate2D,
        profileIdentifier: ProfileIdentifier = .automobileAvoidingTraffic,
        using mapboxNavigation: MapboxNavigation
    ) async throws -> NavigationRoutes {

        let options = NavigationRouteOptions(
            coordinates: [origin, destination],
            profileIdentifier: profileIdentifier
        )

        return try await mapboxNavigation
            .routingProvider()
            .calculateRoutes(options: options)
            .result
            .get()
    }
}

// MARK: - NavigationMode -> ProfileIdentifier
//
// Kept out of NavigationService so the Model layer stays ignorant of the
// Expo-facing NavigationMode type.
extension NavigationMode {
    var profileIdentifier: ProfileIdentifier {
        switch self {
        case .driving: return .automobile
        case .drivingTraffic: return .automobileAvoidingTraffic
        case .walking: return .walking
        case .cycling: return .cycling
        }
    }
}
