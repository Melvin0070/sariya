package expo.modules.sariyavision

import android.content.Context
import android.os.SystemClock
import org.opencv.core.Core
import org.opencv.core.CvType
import org.opencv.core.Mat
import org.opencv.core.MatOfDouble
import org.opencv.core.Size
import org.opencv.imgproc.Imgproc
import java.util.Random

// One frame through the whole chain: fiducial pose -> model v2 mask -> bar family in plane mm. Shared by the live camera
// and by photo replay, so a replayed photo is measured exactly as the live scan would measure it.
object Pipeline {
  class Config(val marker: String, val axis: String, val barDia: Double, val minLenMm: Double)

  private const val MAX_POINTS = 12000
  private const val FOOTPRINT_MM = 2000.0
  private val maskX = DoubleArray(MAX_POINTS)
  private val maskY = DoubleArray(MAX_POINTS)
  private val hits = IntArray(Segmenter.W * Segmenter.H)
  private val half by lazy { Mat() }
  private val lap by lazy { Mat() }

  // Variance of the Laplacian on a half-size frame: falls sharply with motion blur or missed focus. Only compared
  // between frames of the same scan, never against a fixed number, so it needs no per-camera calibration.
  private fun sharpness(gray: Mat): Double {
    Imgproc.resize(gray, half, Size(gray.cols() / 2.0, gray.rows() / 2.0), 0.0, 0.0, Imgproc.INTER_AREA)
    Imgproc.Laplacian(half, lap, CvType.CV_32F)
    val mean = MatOfDouble()
    val sd = MatOfDouble()
    Core.meanStdDev(lap, mean, sd)
    return sd.get(0, 0)[0].let { it * it }
  }

  // rgba: CV_8UC4 in sensor orientation; gray is filled here. rot: clockwise degrees that make the frame upright.
  @Synchronized
  fun process(context: Context, rgba: Mat, gray: Mat, rot: Int, cfg: Config, seed: Long): HashMap<String, Any?> {
    Imgproc.cvtColor(rgba, gray, Imgproc.COLOR_RGBA2GRAY)
    val w = rgba.cols()
    val h = rgba.rows()
    val sharp = sharpness(gray)
    val pose = try { Fiducial.detect(gray, cfg.marker) } catch (t: Throwable) { null }
    var inferMs = -1L
    var result: BarResult? = null
    var modelError: String? = null
    if (pose != null) {
      if (Segmenter.load(context)) {
        val ti = SystemClock.elapsedRealtime()
        val prob = try { Segmenter.run(rgba) } catch (t: Throwable) { modelError = t.message; null }
        inferMs = SystemClock.elapsedRealtime() - ti
        if (prob != null) result = bars(prob, pose, w, h, cfg, seed)
      } else {
        modelError = Segmenter.error
      }
    }
    val up = Upright(rot, w, h)
    val payload = HashMap<String, Any?>()
    payload["w"] = up.w
    payload["h"] = up.h
    payload["model"] = Segmenter.MODEL
    payload["modelSha"] = Segmenter.MODEL_SHA.take(12)
    payload["accel"] = Segmenter.accelerator
    payload["inferMs"] = inferMs
    payload["modelError"] = modelError
    payload["minMarkerPx"] = 45.0 * maxOf(w, h) / 3840.0
    payload["pose"] = pose?.let { p ->
      mapOf(
        "kind" to p.kind,
        "points" to p.points,
        "markerPx" to p.markerPx,
        "pxPerMm" to p.pxPerMm,
        "outline" to p.outlineMm.map { o -> Geo.apply(p.mmToImg, o[0], o[1]).let { up.pt(it[0], it[1]) } },
        "outlineMm" to p.outlineMm.map { it.toList() },
        // What the frame covers on the bar plane, for the coverage map (clamped where the view nears the horizon).
        "footprintMm" to listOf(0.0 to 0.0, w - 1.0 to 0.0, w - 1.0 to h - 1.0, 0.0 to h - 1.0).map { (x, y) ->
          Geo.apply(p.imgToMm, x, y).map { v -> v.coerceIn(-FOOTPRINT_MM, FOOTPRINT_MM) }
        },
      )
    }
    val toMap = { b: Bar ->
      val a = Geo.apply(pose!!.mmToImg, b.a[0], b.a[1])
      val c = Geo.apply(pose.mmToImg, b.b[0], b.b[1])
      mapOf("pos" to b.pos, "seg" to up.pt(a[0], a[1]) + up.pt(c[0], c[1]), "mm" to listOf(b.a[0], b.a[1], b.b[0], b.b[1]), "support" to b.support)
    }
    payload["bars"] = result?.bars?.map(toMap) ?: emptyList<Any>()
    payload["weak"] = result?.weak?.map(toMap) ?: emptyList<Any>()
    payload["angle"] = result?.angleDeg
    payload["maskPts"] = result?.points ?: 0
    payload["sharp"] = sharp
    return payload
  }

  private fun bars(prob: FloatArray, pose: Pose, w: Int, h: Int, cfg: Config, seed: Long): BarResult {
    val sx = w.toDouble() / Segmenter.W
    val sy = h.toDouble() / Segmenter.H
    var nHits = 0
    for (i in prob.indices) if (prob[i] > Segmenter.THRESHOLD) hits[nHits++] = i
    val rnd = Random(seed)
    // Bars hide under the fiducial's edge; points there belong to the print, not to steel.
    val ex = Bars.expand(pose.outlineMm, 3.0)
    val keepAll = nHits <= MAX_POINTS
    var n = 0
    var k = 0
    while (k < (if (keepAll) nHits else MAX_POINTS * 2) && n < MAX_POINTS) {
      val idx = if (keepAll) hits[k] else hits[rnd.nextInt(nHits)]
      k++
      val u = idx % Segmenter.W
      val v = idx / Segmenter.W
      val mm = Geo.apply(pose.imgToMm, (u + 0.5) * sx - 0.5, (v + 0.5) * sy - 0.5)
      if (kotlin.math.abs(mm[0]) > 3000 || kotlin.math.abs(mm[1]) > 3000) continue
      if (Bars.inside(ex, mm[0], mm[1])) continue
      maskX[n] = mm[0]
      maskY[n] = mm[1]
      n++
    }
    val ref = if (pose.kind == "strip") 15.0 else 45.0
    return Bars.extract(maskX, maskY, n, cfg.axis, cfg.barDia, cfg.minLenMm, ref, pose.outlineMm)
  }
}

// Sensor-orientation pixels -> the upright frame the user sees (and the saved evidence photo).
class Upright(private val rot: Int, private val sw: Int, private val sh: Int) {
  val w = if (rot == 90 || rot == 270) sh else sw
  val h = if (rot == 90 || rot == 270) sw else sh
  fun pt(x: Double, y: Double): List<Double> = when (rot) {
    90 -> listOf(sh - 1 - y, x)
    180 -> listOf(sw - 1 - x, sh - 1 - y)
    270 -> listOf(y, sw - 1 - x)
    else -> listOf(x, y)
  }
}
