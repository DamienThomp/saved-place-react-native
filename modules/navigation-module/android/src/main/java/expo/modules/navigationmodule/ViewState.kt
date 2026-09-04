package expo.modules.navigationmodule

sealed class ViewState<out T> {
  data object Idle : ViewState<Nothing>()
  data object Loading : ViewState<Nothing>()
  data class Success<T>(val value: T) : ViewState<T>()
  data class Error(val message: String) : ViewState<Nothing>()
}
