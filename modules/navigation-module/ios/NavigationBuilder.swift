//
//  NavigationBuilder.swift
//  
//
//  Created by Damien L Thompson on 2026-09-02.
//

import MapboxNavigationCore
import MapboxNavigationUIKit
import MapboxDirections
import MapboxMaps

@MainActor
protocol NavigationBuilderProtocol {
    func buildViewController(from session: PreparedNavigationSession) -> NavigationViewController
}

@MainActor
final class NavigationBuilder: NavigationBuilderProtocol {

    func buildViewController(from session: PreparedNavigationSession) -> NavigationViewController {
        let navigationOptions = NavigationOptions(
            mapboxNavigation: session.provider.mapboxNavigation,
            voiceController: session.provider.routeVoiceController,
            eventsManager: session.provider.eventsManager()
        )

        let viewController = NavigationViewController(
            navigationRoutes: session.routes,
            navigationOptions: navigationOptions
        )

        viewController.routeLineTracksTraversal = true

        return viewController
    }
}
