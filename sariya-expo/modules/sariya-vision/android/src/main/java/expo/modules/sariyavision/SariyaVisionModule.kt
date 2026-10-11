package expo.modules.sariyavision

import android.os.SystemClock
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import org.opencv.android.OpenCVLoader
import org.opencv.core.Core
import org.opencv.core.CvType
import org.opencv.core.Mat
import org.opencv.core.Scalar
import org.opencv.imgcodecs.Imgcodecs
import org.opencv.imgproc.Imgproc

class SariyaVisionModule : Module() {
  private val opencv by lazy { OpenCVLoader.initLocal() }

  override fun definition() = ModuleDefinition {
    Name("SariyaVision")

    OnCreate { opencv }

    // Readiness: load the model the way the scan screen does and time one inference on a grey frame.
    AsyncFunction("status") {
      val ctx = appContext.reactContext ?: throw IllegalStateException("No context")
      val cv = opencv
      val ok = cv && Segmenter.load(ctx)
      var inferMs = -1L
      if (ok) {
        val frame = Mat(1080, 1920, CvType.CV_8UC4, Scalar(128.0, 128.0, 128.0, 255.0))
        Segmenter.run(frame) // first run pays one-time setup
        val t0 = SystemClock.elapsedRealtime()
        Segmenter.run(frame)
        inferMs = SystemClock.elapsedRealtime() - t0
        frame.release()
        if (Segmenter.views.get() <= 0) Segmenter.close()
      }
      mapOf(
        "ok" to ok,
        "opencv" to cv,
        "model" to Segmenter.MODEL,
        "modelSha" to Segmenter.sha.take(12),
        "threshold" to Segmenter.THRESHOLD.toDouble(),
        "accel" to if (ok) Segmenter.accelerator else "none",
        "loadMs" to Segmenter.loadMs,
        "inferMs" to inferMs,
        "error" to (if (!cv) "OpenCV failed to load" else Segmenter.error),
        "npuError" to Segmenter.npuError,
      )
    }

    // Photo replay: the live pipeline on a saved photo (treated as upright), for site photos and bench checks.
    AsyncFunction("analyzePhoto") { path: String, marker: String, axis: String, barDia: Double, minLenMm: Double ->
      val ctx = appContext.reactContext ?: throw IllegalStateException("No context")
      if (!opencv) throw IllegalStateException("OpenCV failed to load")
      val bgr = Imgcodecs.imread(path.removePrefix("file://"))
      if (bgr.empty()) throw IllegalArgumentException("Could not read $path")
      val rgba = Mat()
      Imgproc.cvtColor(bgr, rgba, Imgproc.COLOR_BGR2RGBA)
      // The model takes a landscape frame, as the camera sensor gives it. A portrait photo would be squashed 3x into
      // 1152x640, so it is turned back to sensor orientation and reported upright with rot 90, as live frames are.
      val rot = if (rgba.rows() > rgba.cols()) 90 else 0
      if (rot == 90) Mat().also { Core.rotate(rgba, it, Core.ROTATE_90_COUNTERCLOCKWISE); it.copyTo(rgba); it.release() }
      val gray = Mat()
      val t0 = SystemClock.elapsedRealtime()
      val payload = Pipeline.process(ctx, rgba, gray, rot, Pipeline.Config(marker, axis, barDia, minLenMm), 0)
      payload["frameMs"] = SystemClock.elapsedRealtime() - t0
      bgr.release(); rgba.release(); gray.release()
      if (Segmenter.views.get() <= 0) Segmenter.close()
      payload
    }

    View(SariyaCameraView::class) {
      Events("onFrame", "onReady", "onError")
      Prop("active") { v: SariyaCameraView, on: Boolean -> v.active = on }
      Prop("torch") { v: SariyaCameraView, on: Boolean -> v.torch = on }
      Prop("marker") { v: SariyaCameraView, m: String -> v.marker = m }
      Prop("axis") { v: SariyaCameraView, a: String -> v.axis = a }
      Prop("barDia") { v: SariyaCameraView, d: Double -> v.barDia = d }
      Prop("minLenMm") { v: SariyaCameraView, d: Double -> v.minLenMm = d }
      AsyncFunction("freeze") { v: SariyaCameraView, promise: Promise -> v.freeze(promise) }
      OnViewDestroys { it.release() }
    }
  }
}
