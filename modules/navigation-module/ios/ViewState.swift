//
//  ViewState.swift
//  
//
//  Created by Damien L Thompson on 2026-09-02.
//

import Foundation

enum ViewState<Success> {
    case idle
    case loading
    case success(Success)
    case error(message: String)
}
