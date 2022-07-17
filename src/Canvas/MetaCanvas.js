// @ts-nocheck
import { get } from "svelte/store"
import { currentTool, toolSettings, canvasTranslation } from "../lib/stores"
import { Point } from "./Point"

var _main, _base
var canvas
var context
var mousePosition

function Resize() {
    let mainRect = _main.getBoundingClientRect()

    canvas.width = mainRect.width
    canvas.height = mainRect.height
}

function copyCanvas() {
    context.globalCompositeOperation = 'copy'
    context.fillStyle = 'white'
    context.fillRect(0, 0, canvas.width, canvas.height)


    context.globalCompositeOperation = 'source-over'

    context.save()

    var canvasState = get(canvasTranslation)
    var mainRect = _main.getBoundingClientRect()

    context.translate(canvasState.left - mainRect.left, canvasState.top - mainRect.top)
    context.rotate(canvasState.rotation * canvasState.flip)
    context.scale(canvasState.scale * canvasState.flip, canvasState.scale)
    context.filter = "invert(1) grayscale(1) contrast(50)"

    context.drawImage(_base, 0, 0)

    context.restore()
}

const crossSize = 10
const crossCenter = 5

function cursorCross() {
    context.moveTo(mousePosition.x, mousePosition.y + crossSize)
    context.lineTo(mousePosition.x, mousePosition.y + crossCenter)
    context.moveTo(mousePosition.x + crossSize, mousePosition.y)
    context.lineTo(mousePosition.x + crossCenter, mousePosition.y)
    context.moveTo(mousePosition.x, mousePosition.y - crossSize)
    context.lineTo(mousePosition.x, mousePosition.y - crossCenter)
    context.moveTo(mousePosition.x - crossSize, mousePosition.y)
    context.lineTo(mousePosition.x - crossCenter, mousePosition.y)
}

function UpdateCursor() {
    switch(get(currentTool)?.cursor) {
        case 'circle':
            copyCanvas()
            context.globalCompositeOperation = 'destination-in'
            context.beginPath()
            var width = get(toolSettings).width * 0.5 * get(canvasTranslation).scale
            context.ellipse(mousePosition.x, mousePosition.y, width, width, 0, 0, Math.PI * 2)
            if (width < 5)
                cursorCross()
            context.stroke()
            break
        case 'square':
            copyCanvas()
            context.globalCompositeOperation = 'destination-in'
            context.beginPath()
            var size = get(toolSettings).width * 0.5 * get(canvasTranslation).scale
            context.rect(mousePosition.x - size, mousePosition.y - size, size * 2, size * 2)
            if (width < 5)
                cursorCross()
            context.stroke()
            break
        default:
            context.clearRect(0, 0, canvas.width, canvas.height)
    }
}

export default {
    setup: (main, base) => {
        _main = main
        _base = base
        canvas = document.createElement('canvas')
        canvas.style.zIndex = "1"
        canvas.style.imageRendering = "pixelated"

        context = canvas.getContext('2d', { antialias: false })

        _main.appendChild(canvas)
        Resize()
    },
    update: (e = null) => {
        if (_main == null)
            return

        if (e) {
            var rect = _main.getBoundingClientRect()
            mousePosition = new Point(e.pageX - rect.left, e.pageY - rect.top)
        }
        if (mousePosition)
            UpdateCursor()
    },
    clear: () => {
        context.clearRect(0, 0, canvas.width, canvas.height)
    },
    resize: () => {
        Resize()
    }
}