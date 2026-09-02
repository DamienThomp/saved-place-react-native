import ExpoModulesCore
import MapboxNavigationUIKit
import UIKit

class NavigationModuleView: ExpoView {

    let onArrived = EventDispatcher()
    let onCancel = EventDispatcher()

    var origin: CoordinatesRecord?
    var destination: CoordinatesRecord?
    var mode: NavigationMode = .driving

    private lazy var presenter: NavigationPresenterProtocol =
        NavigationPresenterFactory.makePresenter(view: self)

    private let activityIndicator = UIActivityIndicatorView(style: .large)
    private let errorLabel = UILabel()
    private weak var embeddedViewController: UIViewController?

    required init(appContext: AppContext? = nil) {
        super.init(appContext: appContext)
        backgroundColor = .black
        setUpPlaceholderViews()
    }

    override func willMove(toWindow newWindow: UIWindow?) {
        super.willMove(toWindow: newWindow)
        if newWindow == nil {
            presenter.teardown()
        }
    }

    func configureNavigation() {
        guard let origin, let destination else { return }
        presenter.configure(origin: origin, destination: destination, mode: mode)
    }

    private func setUpPlaceholderViews() {
        errorLabel.textAlignment = .center
        errorLabel.numberOfLines = 0
        errorLabel.textColor = .white
        errorLabel.isHidden = true

        for subview in [activityIndicator, errorLabel] {
            subview.translatesAutoresizingMaskIntoConstraints = false
            addSubview(subview)
        }

        NSLayoutConstraint.activate([
            activityIndicator.centerXAnchor.constraint(equalTo: centerXAnchor),
            activityIndicator.centerYAnchor.constraint(equalTo: centerYAnchor),

            errorLabel.centerYAnchor.constraint(equalTo: centerYAnchor),
            errorLabel.leadingAnchor.constraint(equalTo: leadingAnchor, constant: 16),
            errorLabel.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -16),
        ])
    }

    private func embed(_ child: UIViewController) {
        guard embeddedViewController !== child else { return }
        removeEmbedded()

        guard let parent = nearestViewController else { return }
        parent.addChild(child)
        child.view.frame = bounds
        child.view.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        addSubview(child.view)
        child.didMove(toParent: parent)
        embeddedViewController = child
    }

    private func removeEmbedded() {
        guard let child = embeddedViewController else { return }
        child.willMove(toParent: nil)
        child.view.removeFromSuperview()
        child.removeFromParent()
        embeddedViewController = nil
    }
}

// MARK: - NavigationModuleViewProtocol
extension NavigationModuleView: NavigationModuleViewProtocol {
    func render(_ state: ViewState<NavigationViewController>) {
        switch state {
        case .idle:
            removeEmbedded()
            activityIndicator.stopAnimating()
            errorLabel.isHidden = true

        case .loading:
            removeEmbedded()
            errorLabel.isHidden = true
            activityIndicator.startAnimating()

        case .success(let navigationViewController):
            activityIndicator.stopAnimating()
            errorLabel.isHidden = true
            embed(navigationViewController)

        case .error(let message):
            removeEmbedded()
            activityIndicator.stopAnimating()
            errorLabel.text = message
            errorLabel.isHidden = false
        }
    }

    func handleArrival(latitude: Double, longitude: Double) {
        onArrived([
            "latitude": latitude,
            "longitude": longitude,
        ])
    }

    func handleCancel(reason: String) {
        onCancel([
            "reason": reason,
        ])
    }
}

// MARK: - View controller containment helper
private extension UIView {
    /// Walks the responder chain to find the UIViewController hosting this
    /// view. React Native mounts native views without handing us a
    /// controller directly, so this is how we satisfy UIKit's containment
    /// requirements for `NavigationViewController`.
    var nearestViewController: UIViewController? {
        var responder: UIResponder? = self
        while let current = responder {
            if let viewController = current as? UIViewController {
                return viewController
            }
            responder = current.next
        }
        return nil
    }
}
