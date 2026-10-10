package expo.modules.sariyavision

import android.content.Context
import android.util.Log
import com.google.ai.edge.litert.Accelerator
import com.google.ai.edge.litert.CompiledModel
import com.google.ai.edge.litert.Environment
import com.google.ai.edge.litert.TensorBuffer
import org.opencv.core.Mat
import org.opencv.core.Size
import org.opencv.imgproc.Imgproc
import java.util.concurrent.atomic.AtomicInteger

// Bar segmentation model (notes/14-model/MODEL-V*.md): U-Net MobileNetV3, input float32 [1, 640, 1152, 3] raw RGB 0-255
// in sensor orientation, output float32 [1, 640, 1152, 1] probability. Version and threshold come from the build
// (-Psariya.model, -Psariya.threshold); v2's report sets 0.3 because it traded recall for no desk false alarms.
object Segmenter {
  const val W = 1152
  const val H = 640
  const val MODEL = BuildConfig.SARIYA_MODEL
  const val THRESHOLD = BuildConfig.SARIYA_THRESHOLD
  const val MODEL_SHA = BuildConfig.SARIYA_MODEL_SHA
  private const val NPU_FILE = "models/unet_mbv3_1152_sm8850_qairt250.tflite"
  private const val FLOAT_FILE = "models/unet_mbv3_1152.tflite"

  // Live camera views using the model; the readiness check closes it only when none are.
  val views = AtomicInteger()

  private var env: Environment? = null
  private var model: CompiledModel? = null
  private var inBuf: List<TensorBuffer> = emptyList()
  private var outBuf: List<TensorBuffer> = emptyList()
  private val rgb = FloatArray(W * H * 3)
  private val bytes = ByteArray(W * H * 4)
  private val small by lazy { Mat() }

  var accelerator = "none"
    private set
  var loadMs = 0L
    private set
  var error: String? = null
    private set
  // Why the NPU was skipped, so the readiness screen can say it instead of silently showing GPU.
  var npuError: String? = null
    private set

  @Synchronized
  fun load(context: Context): Boolean {
    if (model != null) return true
    val t0 = System.currentTimeMillis()
    val libDir = context.applicationInfo.nativeLibraryDir
    return try {
      val e = Environment.create(mapOf(Environment.Option.DispatchLibraryDir to libDir, Environment.Option.CompilerPluginLibraryDir to libDir))
      env = e
      val assets = context.assets
      var acc = "NPU"
      val m = runCatching {
        val o = CompiledModel.Options(Accelerator.NPU)
        // Burst is what the 12 ms benchmark used; it costs power, so the model is closed when the scan screen goes.
        o.qualcommOptions = CompiledModel.QualcommOptions(htpPerformanceMode = CompiledModel.QualcommOptions.HtpPerformanceMode.BURST)
        CompiledModel.create(assets, NPU_FILE, o, e)
      }.recoverCatching { err ->
        npuError = err.message ?: err.javaClass.simpleName
        Log.w("SariyaVision", "NPU unavailable: $npuError")
        acc = "GPU"
        CompiledModel.create(assets, FLOAT_FILE, CompiledModel.Options(Accelerator.GPU), e)
      }.recoverCatching {
        acc = "CPU"
        CompiledModel.create(assets, FLOAT_FILE, CompiledModel.Options(Accelerator.CPU), e)
      }.getOrThrow()
      model = m
      inBuf = m.createInputBuffers()
      outBuf = m.createOutputBuffers()
      accelerator = acc
      loadMs = System.currentTimeMillis() - t0
      error = null
      true
    } catch (t: Throwable) {
      error = t.message ?: t.javaClass.simpleName
      accelerator = "none"
      close()
      false
    }
  }

  // rgba: the full camera frame in sensor orientation. Returns the probability map, row-major W x H.
  @Synchronized
  fun run(rgba: Mat): FloatArray? {
    val m = model ?: return null
    Imgproc.resize(rgba, small, Size(W.toDouble(), H.toDouble()), 0.0, 0.0, Imgproc.INTER_AREA)
    small.get(0, 0, bytes)
    var j = 0
    var k = 0
    while (k < bytes.size) {
      rgb[j] = (bytes[k].toInt() and 255).toFloat()
      rgb[j + 1] = (bytes[k + 1].toInt() and 255).toFloat()
      rgb[j + 2] = (bytes[k + 2].toInt() and 255).toFloat()
      j += 3
      k += 4
    }
    inBuf[0].writeFloat(rgb)
    m.run(inBuf, outBuf)
    return outBuf[0].readFloat()
  }

  @Synchronized
  fun close() {
    inBuf.forEach { it.close() }
    outBuf.forEach { it.close() }
    inBuf = emptyList()
    outBuf = emptyList()
    model?.close()
    model = null
    env?.close()
    env = null
  }
}
