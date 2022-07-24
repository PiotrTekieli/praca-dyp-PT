import { canvasTranslation, currentTool, toolSettings } from "../lib/stores"
import { Point } from "../Canvas/Point"
import { get } from "svelte/store"

var p
var startPosition
var dragging = false
var angle = 0

var cursorType

export default class Resize {
    displayName = 'Resize'
    name = 'resize'
    mouseCursor = 'arrow'
    cursor = null
    hidden = true

    pointerDown(event, pointer, context) {
        p = pointer

        dragging = true
        startPosition = getScreenPosition(event)
        var width = get(toolSettings).width * 0.5 * get(canvasTranslation).scale

        cursorType = currentTool.getSelected()?.cursor
        switch(cursorType) {
            case 'circle':
                startPosition.x -= Math.cos(angle) * width
                startPosition.y -= Math.sin(angle) * width
                break
            case 'square':
                var angleMod = Math.abs(angle) % (Math.PI / 2)

                if (angleMod < Math.PI / 4)
                    width /= Math.cos(angleMod)
                else
                    width /= Math.sin(angleMod)

                startPosition.x -= Math.cos(angle) * width
                startPosition.y -= Math.sin(angle) * width
                break
        }

        this.cursor = 'resize'
    }

    pointerMove(event) {
        if (dragging) {
            var difference = getScreenPosition(event).Subtract(startPosition)
            var size

            switch (cursorType) {
                case 'circle':
                    size = Math.sqrt(Math.pow(difference.x, 2) + Math.pow(difference.y, 2)) * 2 / get(canvasTranslation).scale
                    break
                case 'square':
                    size = Math.max(Math.abs(difference.x), Math.abs(difference.y)) * 2 / get(canvasTranslation).scale
            }
            toolSettings.setWidth(size)

            angle = Math.atan2(difference.y, difference.x)
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
            this.cursor = null
        }
        return false
    }

    getPosition() {
        return startPosition
    }

    getAngle() {
        return angle
    }

}

function getScreenPosition(event) {
    return new Point(event.pageX, event.pageY)
}