import { canvasTranslation } from "../lib/stores"
import { Point } from "../Canvas/Point"

var p
var screenCenter
var angle
var dragging = false

export default class Rotate {
    cursor = 'grab'

    pointerDown(event, pointer, context) {
        p = pointer

        this.cursor = 'grabbing'
        dragging = true
        screenCenter = new Point(window.innerWidth * 0.5, window.innerHeight * 0.5)
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
        //canvasTranslation.rotate(-20)
        return this.cancel()

    }

    cancel() {
        this.cursor = 'grab'
        p = null

        dragging = false
        return false
    }

}

function getScreenPosition(event) {
    return new Point(event.pageX, event.pageY)
}