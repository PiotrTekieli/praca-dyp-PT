import { canvasTranslation } from "../lib/stores"
import { Point } from "../Canvas/Point"

var p
var startPosition
var dragging = false

export default class Move {
    name = 'move'
    icon = 'favicon.ico'
    cursor = 'grab'

    pointerDown(event, pointer, context) {
        p = pointer

        this.cursor = 'grabbing'
        dragging = true
        startPosition = getScreenPosition(event)
    }

    pointerMove(event) {
        if (dragging) {
            var difference = getScreenPosition(event).Subtract(startPosition)

            canvasTranslation.move(difference.x, difference.y)//set({ left: canvasState.left + difference.x, top: canvasState.top + difference.y })

            startPosition = getScreenPosition(event)
        }
    }

    pointerUp(event) {
        return this.cancel()
    }

    cancel() {
        this.cursor = 'grab'
        p = null
        startPosition = null

        dragging = false
        return false
    }

}

function getScreenPosition(event) {
    return new Point(event.pageX, event.pageY)
}