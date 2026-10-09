package expo.modules.arcorecheck

import com.google.ar.core.ArCoreApk
import expo.modules.kotlin.functions.Queues
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

// Reports the exact ARCore availability so the app can tell "install needed" from "not supported".
class ArcoreCheckModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ArcoreCheck")

    AsyncFunction("checkAvailability") {
      val ctx = appContext.reactContext ?: return@AsyncFunction "UNKNOWN_ERROR"
      var a = ArCoreApk.getInstance().checkAvailability(ctx)
      var tries = 0
      while (a.isTransient && tries < 25) {
        Thread.sleep(200)
        a = ArCoreApk.getInstance().checkAvailability(ctx)
        tries++
      }
      a.name
    }

    AsyncFunction("requestInstall") {
      val act = appContext.currentActivity ?: return@AsyncFunction "NO_ACTIVITY"
      try {
        ArCoreApk.getInstance().requestInstall(act, true).name
      } catch (e: Exception) {
        "UNAVAILABLE"
      }
    }.runOnQueue(Queues.MAIN)
  }
}
