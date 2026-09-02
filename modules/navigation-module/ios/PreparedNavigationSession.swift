//
//  PreparedNavigationSession.swift
//  
//
//  Created by Damien L Thompson on 2026-09-02.
//

import Foundation
import MapboxNavigationCore

struct PreparedNavigationSession: Hashable, Identifiable {
    let id = UUID()
    let routes: NavigationRoutes
    let provider: MapboxNavigationProvider

     static func == (lhs: PreparedNavigationSession, rhs: PreparedNavigationSession) -> Bool {
         lhs.id == rhs.id
     }

     func hash(into hasher: inout Hasher) {
         hasher.combine(id)
     }
}
