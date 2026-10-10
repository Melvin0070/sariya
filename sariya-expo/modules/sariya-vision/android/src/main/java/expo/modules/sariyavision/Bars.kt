package expo.modules.sariyavision

import kotlin.math.abs
import kotlin.math.ceil
import kotlin.math.cos
import kotlin.math.floor
import kotlin.math.max
import kotlin.math.min
import kotlin.math.sin

class Bar(val pos: Double, val a: DoubleArray, val b: DoubleArray, val support: Int)

// weak: candidates with a bar's length but too little of it seen (under the card, blurred, out of the mask).
class BarResult(val bars: List<Bar>, val weak: List<Bar>, val angleDeg: Double, val points: Int)

// Mask points (plane mm) -> one family of parallel bars -> centre positions along the target axis.
// The operator lays the fiducial with its edges along the bars, so the family direction is searched near a plane
// axis instead of fitting free lines: a 1-D offset histogram per candidate angle, sharpest one wins, its peaks are
// the bars. Crossing bars spread over every offset and stay below the peak threshold.
object Bars {
  private const val SEARCH_DEG = 20.0
  private const val MAX_CONT_GAP_BIN_MM = 5.0
  private const val ACCEPT_CONTINUITY = 0.5
  private const val WEAK_CONTINUITY = 0.2

  /**
   * axis "x": positions are plane x, bars run along y (main bars, stirrups on the strip). axis "y": the reverse.
   * ref: where along the bars the position is read (plane y for axis x), normally the fiducial centre line.
   */
  fun extract(xs: DoubleArray, ys: DoubleArray, n: Int, axis: String, barDia: Double, minLenMm: Double, ref: Double, exclude: Array<DoubleArray>): BarResult {
    if (n < 50) return BarResult(emptyList(), emptyList(), 0.0, n)
    val nominal = if (axis == "x") 90.0 else 0.0
    var best = nominal
    var bestScore = -1.0
    var a = nominal - SEARCH_DEG
    while (a <= nominal + SEARCH_DEG) {
      val s = sharpness(xs, ys, n, a)
      if (s > bestScore) { bestScore = s; best = a }
      a += 1.0
    }
    val coarse = best
    a = coarse - 1.0
    while (a <= coarse + 1.0) {
      val s = sharpness(xs, ys, n, a)
      if (s > bestScore) { bestScore = s; best = a }
      a += 0.2
    }

    val th = Math.toRadians(best)
    val dx = cos(th); val dy = sin(th) // along the bars
    val nx = -dy; val ny = dx // across the bars
    val off = DoubleArray(n) { xs[it] * nx + ys[it] * ny }
    val t = DoubleArray(n) { xs[it] * dx + ys[it] * dy }
    var lo = Double.MAX_VALUE; var hi = -Double.MAX_VALUE
    for (i in 0 until n) { lo = min(lo, off[i]); hi = max(hi, off[i]) }
    val bins = (ceil(hi - lo) + 1).toInt().coerceIn(1, 20000)
    val hist = IntArray(bins)
    for (i in 0 until n) hist[((off[i] - lo).toInt()).coerceIn(0, bins - 1)]++
    val box = max(1, barDia.toInt())
    val smooth = DoubleArray(bins)
    var acc = 0
    for (i in 0 until bins + box) {
      if (i < bins) acc += hist[i]
      if (i - box >= 0) acc -= hist[i - box]
      val c = i - box / 2
      if (c in 0 until bins) smooth[c] = acc.toDouble()
    }
    val peakMax = smooth.maxOrNull() ?: 0.0
    val nms = max(12.0, 1.5 * barDia)
    val crossings = crossings(t, n, box, nms)
    // The model under-marks steel at the card's edge and the card hides the rest, so that stretch is not scored.
    val shadow = expand(exclude, max(10.0, 1.5 * barDia))
    val cand = (1 until bins - 1).filter { smooth[it] >= 0.2 * peakMax && smooth[it] >= smooth[it - 1] && smooth[it] >= smooth[it + 1] }
      .sortedByDescending { smooth[it] }
    val taken = ArrayList<Double>()
    val half = barDia / 2 + 2.0
    val bars = ArrayList<Bar>()
    val weak = ArrayList<Bar>()
    for (p in cand) {
      val c0 = lo + p + 0.5
      if (taken.any { abs(it - c0) < nms }) continue
      taken.add(c0)
      // Refine the centre on the points inside the bar's width, then measure its extent and continuity along t.
      var sum = 0.0; var cnt = 0
      for (i in 0 until n) if (abs(off[i] - c0) <= half) { sum += off[i]; cnt++ }
      if (cnt < 30) continue
      val c = sum / cnt
      val ts = ArrayList<Double>(cnt)
      for (i in 0 until n) if (abs(off[i] - c) <= half) ts.add(t[i])
      ts.sort()
      val t0 = ts[(ts.size * 0.02).toInt()]
      val t1 = ts[min(ts.size - 1, (ts.size * 0.98).toInt())]
      if (t1 - t0 < minLenMm) continue
      val cont = continuity(ts, t0, t1, c, nx, ny, dx, dy, shadow, crossings, barDia / 2 + 5)
      if (cont < WEAK_CONTINUITY) continue
      val pa = doubleArrayOf(c * nx + t0 * dx, c * ny + t0 * dy)
      val pb = doubleArrayOf(c * nx + t1 * dx, c * ny + t1 * dy)
      // Position = where the centreline crosses the reference line, so a beam's rings read as strip mm.
      val pos = if (axis == "x") {
        val tr = (ref - c * ny) / dy
        c * nx + tr * dx
      } else {
        val tr = (ref - c * nx) / dx
        c * ny + tr * dy
      }
      (if (cont >= ACCEPT_CONTINUITY) bars else weak).add(Bar(pos, pa, pb, cnt))
    }
    bars.sortBy { it.pos }
    weak.sortBy { it.pos }
    return BarResult(bars, weak, best - nominal, n)
  }

  private fun sharpness(xs: DoubleArray, ys: DoubleArray, n: Int, deg: Double): Double {
    val th = Math.toRadians(deg)
    val nx = -sin(th); val ny = cos(th)
    var lo = Double.MAX_VALUE; var hi = -Double.MAX_VALUE
    for (i in 0 until n) { val o = xs[i] * nx + ys[i] * ny; lo = min(lo, o); hi = max(hi, o) }
    val bins = (ceil(hi - lo) + 1).toInt().coerceIn(1, 20000)
    val h = IntArray(bins)
    for (i in 0 until n) h[((xs[i] * nx + ys[i] * ny - lo).toInt()).coerceIn(0, bins - 1)]++
    var s = 0.0
    for (v in h) s += v.toDouble() * v
    return s
  }

  // Where the other family crosses, as positions along this family's bars. Their pixels sit on every candidate line, so
  // a candidate made only of crossings (a gap between bars) would otherwise look continuous.
  private fun crossings(t: DoubleArray, n: Int, box: Int, nms: Double): List<Double> {
    var lo = Double.MAX_VALUE; var hi = -Double.MAX_VALUE
    for (i in 0 until n) { lo = min(lo, t[i]); hi = max(hi, t[i]) }
    val bins = (ceil(hi - lo) + 1).toInt().coerceIn(1, 20000)
    val h = IntArray(bins)
    for (i in 0 until n) h[((t[i] - lo).toInt()).coerceIn(0, bins - 1)]++
    val sm = DoubleArray(bins)
    var acc = 0
    for (i in 0 until bins + box) {
      if (i < bins) acc += h[i]
      if (i - box >= 0) acc -= h[i - box]
      val c = i - box / 2
      if (c in 0 until bins) sm[c] = acc.toDouble()
    }
    val top = sm.maxOrNull() ?: return emptyList()
    val out = ArrayList<Double>()
    (1 until bins - 1).filter { sm[it] >= 0.35 * top && sm[it] >= sm[it - 1] && sm[it] >= sm[it + 1] }
      .sortedByDescending { sm[it] }
      .forEach { i -> val c = lo + i + 0.5; if (out.none { abs(it - c) < nms }) out.add(c) }
    return out
  }

  fun expand(poly: Array<DoubleArray>, mm: Double): Array<DoubleArray> {
    val cx = poly.sumOf { it[0] } / poly.size
    val cy = poly.sumOf { it[1] } / poly.size
    return Array(poly.size) { doubleArrayOf(poly[it][0] + Math.signum(poly[it][0] - cx) * mm, poly[it][1] + Math.signum(poly[it][1] - cy) * mm) }
  }

  // Occupied fraction of 5 mm bins along the bar, not counting bins in the card's shadow or on a crossing bar.
  private fun continuity(ts: List<Double>, t0: Double, t1: Double, c: Double, nx: Double, ny: Double, dx: Double, dy: Double, exclude: Array<DoubleArray>, crossings: List<Double>, crossHalf: Double): Double {
    val nb = max(1, ceil((t1 - t0) / MAX_CONT_GAP_BIN_MM).toInt())
    val occ = BooleanArray(nb)
    for (v in ts) if (v in t0..t1) occ[min(nb - 1, floor((v - t0) / MAX_CONT_GAP_BIN_MM).toInt())] = true
    var seen = 0; var total = 0
    for (k in 0 until nb) {
      val tm = t0 + (k + 0.5) * MAX_CONT_GAP_BIN_MM
      if (inside(exclude, c * nx + tm * dx, c * ny + tm * dy)) continue
      if (crossings.any { abs(it - tm) <= crossHalf }) continue
      total++
      if (occ[k]) seen++
    }
    return if (total == 0) 0.0 else seen.toDouble() / total
  }

  fun inside(poly: Array<DoubleArray>, x: Double, y: Double): Boolean {
    var inside = false
    var j = poly.size - 1
    for (i in poly.indices) {
      val xi = poly[i][0]; val yi = poly[i][1]; val xj = poly[j][0]; val yj = poly[j][1]
      if ((yi > y) != (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside
      j = i
    }
    return inside
  }
}
