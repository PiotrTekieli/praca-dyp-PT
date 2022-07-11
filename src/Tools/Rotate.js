import { canvasTranslation } from "../lib/stores"
import { Point } from "../Canvas/Point"
import { get } from "svelte/store"

var p
var screenCenter
var angle
var dragging = false

export default class Rotate {
    displayName = 'Rotate'
    name = 'rotate'
    icon = 'favicon.ico'
    cursor = 'ew-resize'

    pointerDown(event, pointer, context) {
        p = pointer

        dragging = true
        screenCenter = get(canvasTranslation).screenCenter
        var difference = getScreenPosition(event).Subtract(screenCenter)
        angle = Math.atan2(difference.y, difference.x)
    }

    pointerMove(event) {
        if (dragging) {
            var difference = getScreenPosition(event).Subtract(screenCenter)
            var angleDiff = Math.atan2(difference.y, difference.x) - angle

            canvasTranslation.rotate(angleDiff)
            angle += angleDiff
        }
    }

    pointerUp(event) {
        return this.cancel()
    }

    cancel() {
        p = null

        dragging = false
        return false
    }

}

function getScreenPosition(event) {
    return new Point(event.pageX, event.pageY)
}