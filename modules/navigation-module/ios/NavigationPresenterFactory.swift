//
//  NavigationServiceFactory.swift
//  
//
//  Created by Damien L Thompson on 2026-09-02.
//

@MainActor
enum NavigationPresenterFactory {
    static func makePresenter(
        view: NavigationModuleViewProtocol,
        service: NavigationServiceProtocol? = nil,
        builder: NavigationBuilderProtocol? = nil
    ) -> NavigationPresenterProtocol {
        NavigationPresenter(
            view: view,
            service: service ?? NavigationService(),
            builder: builder ?? NavigationBuilder()
        )
    }
}
