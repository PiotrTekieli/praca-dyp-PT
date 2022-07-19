import { canvasTranslation, currentTool, toolSettings } from "../lib/stores"
import { Point } from "../Canvas/Point"
import { get } from "svelte/store"

var p
var startPosition
var comparePosition
var dragging = false
var angle = Math.PI / 2

export default class Resize {
    displayName = 'Resize'
    name = 'resize'
    cursor = 'resize'
    hidden = true

    pointerDown(event, pointer, context) {
        p = pointer

        dragging = true
        startPosition = getScreenPosition(event)
        var width = get(toolSettings).width * 0.5 * get(canvasTranslation).scale
        startPosition.x -= Math.sin(angle) * width
        startPosition.y -= Math.cos(angle) * width

        this.cursor = 'resize'
    }

    pointerMove(event) {
        if (dragging) {
            var difference = getScreenPosition(event).Subtract(startPosition)
            var size = Math.sqrt(Math.pow(difference.x, 2) + Math.pow(difference.y, 2)) * 2 / get(canvasTranslation).scale
            toolSettings.setWidth(size)

            angle = -Math.atan2(difference.y, difference.x) + Math.PI / 2
        }
    }

    pointerUp(event) {
        return this.cancel()
    }

    cancel() {
        if (dragging) {
            p = null
            startPosition = null

            dragging = false
            this.copyCursor()
        }
        return false
    }

    getPosition() {
        return startPosition
    }

    getAngle() {
        return angle
    }

    copyCursor() {
        this.cursor = currentTool.getSelected()?.cursor
    }

}

function getScreenPosition(event) {
    return new Point(event.pageX, event.pageY)
}