/*
  Turning a picked cover file into something storage can afford.

  Everything this app keeps lives in localStorage, which holds about 5 MB for
  the whole origin — and a phone photo is easily more than half of that on its
  own. Store two or three and saves start failing; because `saveStore` swallows
  its errors, they would fail *quietly*, and the rest of the app would go on
  looking fine while nothing was being written.

  So every image is redrawn onto a canvas at a fixed maximum size and
  re-encoded as JPEG before it is ever handed to storage. A 4 MB photo lands
  around 150 KB, which is the difference between this feature working and it
  working three times.

  No dependency: canvas and FileReader are built into the browser.
*/

/** The longest edge of a stored cover, in pixels. */
const MAX_EDGE = 1200

/** JPEG quality. 0.82 is not visibly softer than the original at card size. */
const QUALITY = 0.82

/**
 * Reads an image file and returns it as a data URL small enough to store.
 *
 * Rejects with a sentence meant for the person who picked the file, because
 * this is called straight from the editor and there is nothing else to catch
 * it. The caller shows the message next to the cover control.
 */
export function fileToCover(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("That file is not an image."))
      return
    }

    const reader = new FileReader()
    reader.onerror = () => reject(new Error("The file could not be read."))
    reader.onload = () => {
      const source = String(reader.result)

      const image = new Image()
      image.onerror = () => reject(new Error("That image could not be opened."))
      image.onload = () => {
        // Small images are already affordable, and re-encoding one would only
        // cost it its transparency for no gain — a small PNG icon coming back
        // as a JPEG with a white box behind it.
        if (image.width <= MAX_EDGE && image.height <= MAX_EDGE) {
          resolve(source)
          return
        }

        try {
          resolve(resize(image))
        } catch {
          // Anything the canvas refuses — a malformed file, an SVG with an
          // outside reference it isn't allowed to draw. The original still
          // works as a cover, so hand that back rather than failing.
          resolve(source)
        }
      }
      image.src = source
    }
    reader.readAsDataURL(file)
  })
}

/** Draws the image onto a canvas at most `MAX_EDGE` wide and re-encodes it. */
function resize(image: HTMLImageElement): string {
  const scale = Math.min(1, MAX_EDGE / Math.max(image.width, image.height))
  const width = Math.round(image.width * scale)
  const height = Math.round(image.height * scale)

  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext("2d")
  if (context === null) throw new Error("No drawing context.")

  // JPEG has no transparency, so a transparent PNG would otherwise come back
  // with a black background. White is a better default behind a cover photo.
  context.fillStyle = "#ffffff"
  context.fillRect(0, 0, width, height)
  context.drawImage(image, 0, 0, width, height)

  return canvas.toDataURL("image/jpeg", QUALITY)
}
