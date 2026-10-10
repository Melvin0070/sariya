package expo.modules.sariyavision

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import java.util.Random

// Synthetic mask points in card mm: a mesh like the half-scale prop, with card S lying on it.
class BarsTest {
  private val card = arrayOf(doubleArrayOf(-5.0, -5.0), doubleArrayOf(95.0, -5.0), doubleArrayOf(95.0, 95.0), doubleArrayOf(-5.0, 95.0))
  private val rnd = Random(7)

  private class Pts { val x = ArrayList<Double>(); val y = ArrayList<Double>() }

  // A bar along y at x = c (or along x at y = c), w mm wide in the mask, from a to b; `keep` drops stretches.
  private fun bar(p: Pts, alongY: Boolean, c: Double, a: Double, b: Double, w: Double = 8.0, keep: (Double) -> Boolean = { true }) {
    var t = a
    while (t <= b) {
      if (keep(t)) for (k in 0 until 3) {
        val o = c + (rnd.nextDouble() - 0.5) * w
        if (alongY) { p.x.add(o); p.y.add(t) } else { p.x.add(t); p.y.add(o) }
      }
      t += 0.5
    }
  }

  private fun outsideCard(x: Double, y: Double) = !Bars.inside(Bars.expand(card, 3.0), x, y)

  private fun run(p: Pts, axis: String): BarResult {
    val keep = p.x.indices.filter { outsideCard(p.x[it], p.y[it]) }
    val xs = DoubleArray(keep.size) { p.x[keep[it]] }
    val ys = DoubleArray(keep.size) { p.y[keep[it]] }
    return Bars.extract(xs, ys, xs.size, axis, 8.0, 64.0, 45.0, card)
  }

  @Test
  fun meshSpacingAndWideGap() {
    val p = Pts()
    for (x in listOf(-70.0, -20.0, 30.0, 80.0, 145.0)) bar(p, true, x, -110.0, 150.0)
    for (y in listOf(-75.0, -25.0, 25.0, 75.0, 125.0)) bar(p, false, y, -110.0, 190.0)
    val r = run(p, "x")
    assertEquals(listOf(-70.0, -20.0, 30.0, 80.0, 145.0), r.bars.map { Math.round(it.pos).toDouble() })
    assertTrue(r.weak.isEmpty())
  }

  // The model marks only short stubs either side of the card: the bar must be flagged, never silently dropped.
  @Test
  fun barUnderCardIsWeakOrFound() {
    val p = Pts()
    for (x in listOf(-70.0, -20.0, 30.0, 80.0, 145.0)) bar(p, true, x, -110.0, 150.0)
    for (y in listOf(-75.0, -25.0, 125.0)) bar(p, false, y, -110.0, 190.0)
    for (y in listOf(25.0, 75.0)) bar(p, false, y, -110.0, 190.0, keep = { t -> t < -40 || t > 140 })
    val r = run(p, "y")
    val seen = (r.bars + r.weak).map { Math.round(it.pos).toDouble() }.sorted()
    assertEquals(listOf(-75.0, -25.0, 25.0, 75.0, 125.0), seen)
  }

  // Gaps between bars contain only crossing-bar pixels (blurred wider than the bar in real masks); they must not
  // become bars or weak candidates.
  @Test
  fun crossingsAreNotBars() {
    val p = Pts()
    for (x in listOf(-70.0, -20.0, 30.0, 80.0, 130.0)) bar(p, true, x, -110.0, 150.0, w = 12.0)
    // Patchy target bars, so the crossing-bar floor reaches the peak threshold as it does on real masks.
    for (y in listOf(-75.0, 125.0)) bar(p, false, y, -110.0, 190.0, keep = { t -> Math.floorMod(t.toInt(), 20) < 15 })
    // Real masks bleed at intersections: blobs on the gap line y = 25, only where the vertical bars cross it.
    for (x in listOf(-70.0, -20.0, 30.0, 80.0, 130.0)) bar(p, false, 25.0, x - 7, x + 7)
    val r = run(p, "y")
    assertEquals(listOf(-75.0, 125.0), r.bars.map { Math.round(it.pos).toDouble() })
    assertTrue("weak: ${r.weak.map { it.pos }}", r.weak.isEmpty())
  }
}
