package expo.modules.sariyavision

import android.annotation.SuppressLint
import android.content.Context
import android.os.SystemClock
import android.util.Log
import android.util.Size
import androidx.camera.core.Camera
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.ImageProxy
import androidx.camera.core.Preview
import androidx.camera.core.resolutionselector.AspectRatioStrategy
import androidx.camera.core.resolutionselector.ResolutionSelector
import androidx.camera.core.resolutionselector.ResolutionStrategy
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.core.content.ContextCompat
import androidx.lifecycle.LifecycleOwner
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.Promise
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ExpoView
import org.opencv.android.Utils
import org.opencv.core.Core
import org.opencv.core.Mat
import org.opencv.core.MatOfInt
import org.opencv.imgcodecs.Imgcodecs
import org.opencv.imgproc.Imgproc
import java.io.File
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

@SuppressLint("ViewConstructor")
class SariyaCameraView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  var active = true
  var marker = "card"
  var axis = "x"
  var barDia = 10.0
  var minLenMm = 80.0
  var torch = false
    set(v) {
      field = v
      camera?.cameraControl?.enableTorch(v)
    }

  private val onFrame by EventDispatcher<Map<String, Any?>>()
  private val onReady by EventDispatcher<Map<String, Any?>>()
  private val onError by EventDispatcher<Map<String, Any?>>()

  private val previewView = PreviewView(context).apply {
    implementationMode = PreviewView.ImplementationMode.COMPATIBLE
    scaleType = PreviewView.ScaleType.FILL_CENTER
  }
  private val executor: ExecutorService = Executors.newSingleThreadExecutor()
  private var provider: ProcessCameraProvider? = null
  private var preview: Preview? = null
  private var analysis: ImageAnalysis? = null
  private var camera: Camera? = null
  private var bound = false
  private var released = false

  private val rgba = Mat()
  private val gray = Mat()
  private val last = Mat()
  private var lastRot = 0
  private var lastPayload: Map<String, Any?>? = null
  private var frameNo = 0L

  // PreviewView adds its TextureView after the camera starts; React Native would swallow that layout request.
  override val shouldUseAndroidLayout = true

  init {
    addView(previewView)
  }

  override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
    super.onMeasure(widthMeasureSpec, heightMeasureSpec)
    measureChild(previewView, widthMeasureSpec, heightMeasureSpec)
  }

  override fun onLayout(changed: Boolean, left: Int, top: Int, right: Int, bottom: Int) {
    previewView.layout(0, 0, right - left, bottom - top)
  }

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()
    bind()
  }

  override fun onDetachedFromWindow() {
    super.onDetachedFromWindow()
    unbind()
  }

  private fun bind() {
    if (bound || released) return
    val owner = appContext.currentActivity as? LifecycleOwner ?: return emitError("No activity to attach the camera to")
    val future = ProcessCameraProvider.getInstance(context)
    future.addListener({
      try {
        if (released) return@addListener
        val p = future.get()
        val selector = ResolutionSelector.Builder()
          .setAspectRatioStrategy(AspectRatioStrategy.RATIO_16_9_FALLBACK_AUTO_STRATEGY)
          .setResolutionStrategy(ResolutionStrategy(Size(1920, 1080), ResolutionStrategy.FALLBACK_RULE_CLOSEST_LOWER_THEN_HIGHER))
          .build()
        val pv = Preview.Builder().setResolutionSelector(selector).build().also { it.surfaceProvider = previewView.surfaceProvider }
        val an = ImageAnalysis.Builder()
          .setResolutionSelector(selector)
          .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
          .setOutputImageFormat(ImageAnalysis.OUTPUT_IMAGE_FORMAT_RGBA_8888)
          .build()
        an.setAnalyzer(executor) { analyze(it) }
        p.unbindAll()
        camera = p.bindToLifecycle(owner, CameraSelector.DEFAULT_BACK_CAMERA, pv, an)
        camera?.cameraControl?.enableTorch(torch)
        provider = p
        preview = pv
        analysis = an
        bound = true
        Segmenter.views.incrementAndGet()
        onReady(mapOf("ok" to true))
      } catch (t: Throwable) {
        emitError(t.message ?: "Camera failed to start")
      }
    }, ContextCompat.getMainExecutor(context))
  }

  private fun unbind() {
    if (!bound) return
    bound = false
    analysis?.clearAnalyzer()
    val uses = listOfNotNull(preview, analysis).toTypedArray()
    provider?.unbind(*uses)
    camera = null
    if (Segmenter.views.decrementAndGet() <= 0) executor.execute { Segmenter.close() }
  }

  fun release() {
    unbind()
    released = true
    executor.execute {
      rgba.release(); gray.release(); last.release()
    }
    executor.shutdown()
  }

  private fun emitError(msg: String) {
    post { onError(mapOf("message" to msg)) }
  }

  private fun analyze(image: ImageProxy) {
    if (!active || released) {
      image.close()
      return
    }
    val t0 = SystemClock.elapsedRealtime()
    frameNo++
    val rot = image.imageInfo.rotationDegrees
    try {
      val bmp = image.toBitmap()
      image.close()
      Utils.bitmapToMat(bmp, rgba)
      bmp.recycle()
    } catch (t: Throwable) {
      image.close()
      return
    }
    val payload = Pipeline.process(context, rgba, gray, rot, Pipeline.Config(marker, axis, barDia, minLenMm), frameNo)
    payload["frameMs"] = SystemClock.elapsedRealtime() - t0
    if (frameNo % 30 == 0L) Log.i("SariyaVision", "frame rot $rot pose=${(payload["pose"] as Map<*, *>?)?.get("points")} bars=${(payload["bars"] as List<*>).size} ${payload["accel"]} infer=${payload["inferMs"]} total=${payload["frameMs"]}")
    synchronized(last) {
      rgba.copyTo(last)
      lastRot = rot
      lastPayload = payload
    }
    post { if (!released) onFrame(payload) }
  }

  fun freeze(promise: Promise) {
    if (released) return promise.reject("ERR_RELEASED", "The camera is closed", null)
    executor.execute {
      try {
        val out = Mat()
        val payload: Map<String, Any?>
        synchronized(last) {
          if (last.empty() || lastPayload == null) {
            promise.reject("ERR_NO_FRAME", "No camera frame yet", null)
            return@execute
          }
          when (lastRot) {
            90 -> Core.rotate(last, out, Core.ROTATE_90_CLOCKWISE)
            180 -> Core.rotate(last, out, Core.ROTATE_180)
            270 -> Core.rotate(last, out, Core.ROTATE_90_COUNTERCLOCKWISE)
            else -> last.copyTo(out)
          }
          payload = lastPayload!!
        }
        Imgproc.cvtColor(out, out, Imgproc.COLOR_RGBA2BGR)
        val file = File(context.cacheDir, "sariya-frame-${System.currentTimeMillis()}.jpg")
        Imgcodecs.imwrite(file.absolutePath, out, MatOfInt(Imgcodecs.IMWRITE_JPEG_QUALITY, 92))
        val res = mapOf("uri" to "file://${file.absolutePath}", "w" to out.cols(), "h" to out.rows(), "frame" to payload)
        out.release()
        promise.resolve(res)
      } catch (t: Throwable) {
        promise.reject("ERR_FREEZE", t.message ?: "Could not save the frame", t)
      }
    }
  }

}
