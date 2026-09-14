package ru.mersibo.games

import android.content.Context
import android.util.Log
import fi.iki.elonen.NanoHTTPD
import okhttp3.OkHttpClient
import okhttp3.Request
import java.io.ByteArrayInputStream
import java.io.File
import java.io.FileInputStream
import java.io.FileOutputStream
import java.io.InputStream
import java.util.concurrent.TimeUnit

class MersiboLocalServer(
    private val context: Context,
    port: Int = 8080
) : NanoHTTPD("127.0.0.1", port) {

    private val TAG = "MersiboServer"
    private val remoteBaseUrl = "https://mersibo.ru/sites/all/modules/voxunity/data"

    // Storage for on-demand downloaded games and assets
    private val gamesCacheDir: File = File(context.filesDir, "mersibo_storage").apply {
        if (!exists()) mkdirs()
    }

    private val httpClient = OkHttpClient.Builder()
        .connectTimeout(15, TimeUnit.SECONDS)
        .readTimeout(60, TimeUnit.SECONDS)
        .build()

    override fun serve(session: IHTTPSession): Response {
        val uri = session.uri
        val method = session.method

        if (uri == "/api/client-log") {
            return newFixedLengthResponse(Response.Status.OK, "text/plain", "ok")
        }

        val assetPath = if (uri.startsWith("/")) uri.substring(1) else uri

        // 1. Check in Android assets (bundled games & Unity engine)
        try {
            val assetStream = context.assets.open("www/$assetPath")
            return createAssetResponse(assetStream, assetPath, method)
        } catch (_: Exception) {
            // Not in assets, check local disk cache
        }

        // 2. Check local downloaded cache in app's internal storage
        val cachedFile = File(gamesCacheDir, assetPath)
        if (cachedFile.exists() && cachedFile.isFile && cachedFile.length() > 0) {
            return createFileResponse(cachedFile, method)
        }

        // 3. Fallback / Proxy to remote Mersibo server and cache permanently
        if (uri.startsWith("/webgl/StreamingAssets/")) {
            val relPath = uri.removePrefix("/webgl/StreamingAssets/")
            val remoteUrl = "$remoteBaseUrl/$relPath"
            return proxyAndCache(remoteUrl, cachedFile, method)
        }

        return newFixedLengthResponse(Response.Status.NOT_FOUND, "text/plain", "File not found: $uri")
    }

    private fun createAssetResponse(inputStream: InputStream, path: String, method: Method): Response {
        val mime = getMimeType(path)
        val resp = if (method == Method.HEAD) {
            val length = try {
                context.assets.openFd("www/$path").length
            } catch (_: Exception) {
                inputStream.available().toLong()
            }
            val r = newFixedLengthResponse(Response.Status.OK, mime, "")
            if (length > 0) r.addHeader("Content-Length", length.toString())
            r
        } else {
            val length = try {
                context.assets.openFd("www/$path").length
            } catch (_: Exception) {
                inputStream.available().toLong()
            }
            if (length > 0) {
                newFixedLengthResponse(Response.Status.OK, mime, inputStream, length)
            } else {
                newChunkedResponse(Response.Status.OK, mime, inputStream)
            }
        }
        addCorsHeaders(resp)
        return resp
    }

    private fun createFileResponse(file: File, method: Method): Response {
        val mime = getMimeType(file.name)
        val resp = if (method == Method.HEAD) {
            val r = newFixedLengthResponse(Response.Status.OK, mime, "")
            r.addHeader("Content-Length", file.length().toString())
            r
        } else {
            val r = newFixedLengthResponse(Response.Status.OK, mime, FileInputStream(file), file.length())
            r
        }
        addCorsHeaders(resp)
        return resp
    }

    private fun proxyAndCache(remoteUrl: String, destinationFile: File, method: Method): Response {
        Log.i(TAG, "Proxying request: $remoteUrl")
        try {
            val reqBuilder = Request.Builder()
                .url(remoteUrl)
                .header("User-Agent", "Mozilla/5.0 (Android; Mobile; rv:120.0) Gecko/120.0 Firefox/120.0")
                .header("Accept", "*/*")

            if (method == Method.HEAD) {
                reqBuilder.head()
            } else {
                reqBuilder.get()
            }

            val response = httpClient.newCall(reqBuilder.build()).execute()
            if (!response.isSuccessful) {
                return newFixedLengthResponse(
                    Response.Status.lookup(response.code) ?: Response.Status.NOT_FOUND,
                    "text/plain",
                    "Remote error ${response.code}"
                )
            }

            val mime = getMimeType(destinationFile.name)

            if (method == Method.HEAD) {
                val cl = response.header("Content-Length") ?: "0"
                val r = newFixedLengthResponse(Response.Status.OK, mime, "")
                r.addHeader("Content-Length", cl)
                addCorsHeaders(r)
                response.close()
                return r
            }

            val body = response.body
            if (body != null) {
                destinationFile.parentFile?.mkdirs()
                val tempFile = File(destinationFile.parentFile, destinationFile.name + ".tmp")
                val inStream = body.byteStream()
                val outStream = FileOutputStream(tempFile)

                val buffer = ByteArray(32 * 1024)
                var bytesRead: Int
                while (inStream.read(buffer).also { bytesRead = it } != -1) {
                    outStream.write(buffer, 0, bytesRead)
                }
                outStream.flush()
                outStream.close()
                inStream.close()

                if (tempFile.renameTo(destinationFile)) {
                    Log.i(TAG, "Successfully cached: ${destinationFile.absolutePath} (${destinationFile.length()} bytes)")
                } else {
                    tempFile.copyTo(destinationFile, overwrite = true)
                    tempFile.delete()
                }

                return createFileResponse(destinationFile, Method.GET)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Proxy failed for $remoteUrl", e)
        }

        return newFixedLengthResponse(Response.Status.NOT_FOUND, "text/plain", "Failed to fetch from remote")
    }

    private fun addCorsHeaders(response: Response) {
        response.addHeader("Access-Control-Allow-Origin", "*")
        response.addHeader("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS")
        response.addHeader("Access-Control-Allow-Headers", "*")
        response.addHeader("Cross-Origin-Opener-Policy", "same-origin")
        response.addHeader("Cross-Origin-Embedder-Policy", "require-corp")
        response.addHeader("Cache-Control", "no-cache")
    }

    private fun getMimeType(path: String): String {
        val lower = path.lowercase()
        return when {
            lower.endsWith(".html") -> "text/html; charset=utf-8"
            lower.endsWith(".js") -> "application/javascript"
            lower.endsWith(".json") -> "application/json"
            lower.endsWith(".xml") -> "application/xml"
            lower.endsWith(".css") -> "text/css"
            lower.endsWith(".png") -> "image/png"
            lower.endsWith(".jpg") || lower.endsWith(".jpeg") -> "image/jpeg"
            lower.endsWith(".mp3") -> "audio/mpeg"
            lower.endsWith(".ogg") -> "audio/ogg"
            lower.endsWith(".wasm") -> "application/wasm"
            lower.endsWith(".unityweb") -> "application/octet-stream"
            lower.endsWith(".bundle") -> "application/octet-stream"
            else -> "application/octet-stream"
        }
    }
}
