package expo.modules.sariyavision

import org.opencv.calib3d.Calib3d
import org.opencv.core.CvType
import org.opencv.core.Mat
import org.opencv.core.MatOfPoint2f
import org.opencv.core.MatOfPoint3f
import org.opencv.core.Point
import org.opencv.core.Size
import org.opencv.objdetect.ArucoDetector
import org.opencv.objdetect.CharucoBoard
import org.opencv.objdetect.CharucoDetector
import org.opencv.objdetect.DetectorParameters
import org.opencv.objdetect.Objdetect
import kotlin.math.hypot

// The printed fiducials (prep/ref_pipeline/fiducials.py), all DICT_5X5_1000:
//   card S     6x6 ChArUco, 15 mm squares, 11 mm markers, ids 360..377, 5 mm margin
//   strip_300  12 markers of 20 mm at 25 mm pitch on a 300 x 30 mm band, ids 450..461
// Plane frame: x right, y down on the print, mm; origin at the chess pattern's top-left (card) or the band's 0 end (strip).
class Pose(
  val kind: String,
  val points: Int, // ChArUco corners (card) or markers (strip)
  val imgToMm: DoubleArray,
  val mmToImg: DoubleArray,
  val markerPx: Double, // mean detected marker side
  val pxPerMm: Double,
  val outlineMm: Array<DoubleArray>,
)

object Fiducial {
  private val dict by lazy { Objdetect.getPredefinedDictionary(Objdetect.DICT_5X5_1000) }
  private val params by lazy {
    DetectorParameters().apply {
      set_cornerRefinementMethod(Objdetect.CORNER_REFINE_SUBPIX)
      set_cornerRefinementWinSize(5)
      // 0.03 of 1920 px = 14 px marker sides: still finds card S well beyond the "move closer" gate (~22 px at
      // 1080p), while skipping the smallest candidates. Aruco3 searches on a downscaled image first.
      set_minMarkerPerimeterRate(0.03)
      set_useAruco3Detection(true)
    }
  }
  private val cardBoard by lazy {
    val ids = Mat(18, 1, CvType.CV_32S).apply { put(0, 0, IntArray(18) { 360 + it }) }
    CharucoBoard(Size(6.0, 6.0), 15f, 11f, dict, ids)
  }
  private val cardCorners by lazy { MatOfPoint3f(cardBoard.chessboardCorners).toArray() }
  private val charuco by lazy { CharucoDetector(cardBoard).apply { detectorParameters = params } }
  private val aruco by lazy { ArucoDetector(dict, params) }

  val CARD_OUTLINE = arrayOf(doubleArrayOf(-5.0, -5.0), doubleArrayOf(95.0, -5.0), doubleArrayOf(95.0, 95.0), doubleArrayOf(-5.0, 95.0))
  val STRIP_OUTLINE = arrayOf(doubleArrayOf(0.0, 0.0), doubleArrayOf(300.0, 0.0), doubleArrayOf(300.0, 30.0), doubleArrayOf(0.0, 30.0))

  fun detect(gray: Mat, kind: String): Pose? = if (kind == "strip") strip(gray) else card(gray)

  private fun card(gray: Mat): Pose? {
    val corners = Mat()
    val ids = Mat()
    val mCorners = ArrayList<Mat>()
    val mIds = Mat()
    charuco.detectBoard(gray, corners, ids, mCorners, mIds)
    val n = ids.rows()
    if (n < 4) return null
    val img = ArrayList<Point>(n)
    val obj = ArrayList<Point>(n)
    val c = FloatArray(2)
    val id = IntArray(1)
    for (i in 0 until n) {
      corners.get(i, 0, c)
      ids.get(i, 0, id)
      val o = cardCorners.getOrNull(id[0]) ?: continue
      img.add(Point(c[0].toDouble(), c[1].toDouble()))
      obj.add(Point(o.x, o.y))
    }
    return pose("card", img, obj, mCorners, CARD_OUTLINE)
  }

  private fun strip(gray: Mat): Pose? {
    val mCorners = ArrayList<Mat>()
    val mIds = Mat()
    aruco.detectMarkers(gray, mCorners, mIds)
    val img = ArrayList<Point>()
    val obj = ArrayList<Point>()
    val kept = ArrayList<Mat>()
    val id = IntArray(1)
    val c = FloatArray(8)
    for (i in 0 until mIds.rows()) {
      mIds.get(i, 0, id)
      val k = id[0] - 450
      if (k !in 0 until 12) continue
      mCorners[i].get(0, 0, c)
      val x0 = k * 25.0 + 2.5
      val y0 = 5.0
      val sq = arrayOf(Point(x0, y0), Point(x0 + 20, y0), Point(x0 + 20, y0 + 20), Point(x0, y0 + 20))
      for (j in 0 until 4) {
        img.add(Point(c[2 * j].toDouble(), c[2 * j + 1].toDouble()))
        obj.add(sq[j])
      }
      kept.add(mCorners[i])
    }
    if (kept.isEmpty()) return null
    return pose("strip", img, obj, kept, STRIP_OUTLINE, kept.size)
  }

  private fun pose(kind: String, img: List<Point>, obj: List<Point>, markers: List<Mat>, outline: Array<DoubleArray>, count: Int = img.size): Pose? {
    if (img.size < 4) return null
    val method = if (img.size >= 12) Calib3d.RANSAC else 0
    val h = Calib3d.findHomography(MatOfPoint2f(*img.toTypedArray()), MatOfPoint2f(*obj.toTypedArray()), method, 3.0)
    if (h.empty()) return null
    val toMm = DoubleArray(9)
    h.get(0, 0, toMm)
    val toImg = Geo.invert(toMm) ?: return null
    var side = 0.0
    var sides = 0
    val c = FloatArray(8)
    for (m in markers) {
      m.get(0, 0, c)
      for (j in 0 until 4) {
        val k = (j + 1) % 4
        side += hypot((c[2 * k] - c[2 * j]).toDouble(), (c[2 * k + 1] - c[2 * j + 1]).toDouble())
        sides++
      }
    }
    val o = outline.map { Geo.apply(toImg, it[0], it[1]) }
    val perimPx = (0 until 4).sumOf { hypot(o[(it + 1) % 4][0] - o[it][0], o[(it + 1) % 4][1] - o[it][1]) }
    val perimMm = (0 until 4).sumOf { hypot(outline[(it + 1) % 4][0] - outline[it][0], outline[(it + 1) % 4][1] - outline[it][1]) }
    return Pose(kind, count, toMm, toImg, if (sides > 0) side / sides else 0.0, perimPx / perimMm, outline)
  }
}

object Geo {
  fun apply(h: DoubleArray, x: Double, y: Double): DoubleArray {
    val w = h[6] * x + h[7] * y + h[8]
    return doubleArrayOf((h[0] * x + h[1] * y + h[2]) / w, (h[3] * x + h[4] * y + h[5]) / w)
  }

  fun invert(m: DoubleArray): DoubleArray? {
    val a = m[4] * m[8] - m[5] * m[7]
    val b = m[5] * m[6] - m[3] * m[8]
    val c = m[3] * m[7] - m[4] * m[6]
    val det = m[0] * a + m[1] * b + m[2] * c
    if (kotlin.math.abs(det) < 1e-12) return null
    return doubleArrayOf(
      a / det, (m[2] * m[7] - m[1] * m[8]) / det, (m[1] * m[5] - m[2] * m[4]) / det,
      b / det, (m[0] * m[8] - m[2] * m[6]) / det, (m[2] * m[3] - m[0] * m[5]) / det,
      c / det, (m[1] * m[6] - m[0] * m[7]) / det, (m[0] * m[4] - m[1] * m[3]) / det,
    )
  }
}
