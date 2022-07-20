import { canvasTranslation } from "../lib/stores"
import { Point } from "../Canvas/Point"

var p
var startPosition
var comparePosition
var dragging = false

export default class Zoom {
    displayName = 'Zoom'
    name = 'zoom'
    icon = 'zoom.png'
    cursor = 'zoom_in'

    pointerDown(event, pointer, context) {
        p = pointer

        dragging = true
        startPosition = getScreenPosition(event)
        comparePosition = startPosition
    }

    pointerMove(event) {
        if (dragging) {
            var difference = getScreenPosition(event).Subtract(comparePosition)

            canvasTranslation.zoom(difference.x, startPosition)

            comparePosition = getScreenPosition(event)
        }
    }

    pointerUp(event) {
        //canvasTranslation.rotate(-20)
        return this.cancel()

    }

    cancel() {
        if (dragging) {
            p = null
            startPosition = null

            dragging = false
        }
        return false
    }

}

function getScreenPosition(event) {
    return new Point(event.pageX, event.pageY)
}