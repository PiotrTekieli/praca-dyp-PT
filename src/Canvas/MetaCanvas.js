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

    context = canvas.getContext('2d', { antialias: false })
    context.translate(0.5, 0.5)
    context.lineWidth = 0.8
    context.globalCompositeOperation = 'destination-in'
}

function copyCanvas() {
    context.save()

    context.globalCompositeOperation = 'copy'
    context.fillStyle = 'white'
    context.fillRect(0, 0, canvas.width, canvas.height)

    context.globalCompositeOperation = 'source-over'

    var canvasState = get(canvasTranslation)
    var mainRect = _main.getBoundingClientRect()

    context.translate(canvasState.left - mainRect.left, canvasState.top - mainRect.top)
    context.rotate(canvasState.rotation * canvasState.flip)
    context.scale(canvasState.scale * canvasState.flip, canvasState.scale)
    context.filter = "invert(1) grayscale(1) contrast(50)"

    context.drawImage(_base, 0, 0)

    context.restore()
}

const crossSize = 5
const crossCenter = 2

function cursorCross() {
    var pos = {x: Math.round(mousePosition.x), y: Math.round(mousePosition.y)}
    context.moveTo(pos.x, pos.y + crossSize)
    context.lineTo(pos.x, pos.y + crossCenter)
    context.moveTo(pos.x + crossSize, pos.y)
    context.lineTo(pos.x + crossCenter, pos.y)
    context.moveTo(pos.x, pos.y - crossSize)
    context.lineTo(pos.x, pos.y - crossCenter)
    context.moveTo(pos.x - crossSize, pos.y)
    context.lineTo(pos.x - crossCenter, pos.y)
}

function UpdateCursor() {
    switch(get(currentTool)?.cursor) {
        case 'circle':
            copyCanvas()
            context.beginPath()
            var width = get(toolSettings).width * 0.5 * get(canvasTranslation).scale
            context.ellipse(mousePosition.x, mousePosition.y, width, width, 0, 0, Math.PI * 2)
            cursorCross()
            context.stroke()
            break
        case 'square':
            copyCanvas()
            context.beginPath()
            var size = get(toolSettings).width * 0.5 * get(canvasTranslation).scale
            context.rect(mousePosition.x - size, mousePosition.y - size, size * 2, size * 2)
            cursorCross()
            context.stroke()
            break
        case 'resize':
            var pos = {x: get(currentTool).getPosition()?.x, y: get(currentTool).getPosition()?.y}
            if (!pos.x)
                return

            var mainRect = _main.getBoundingClientRect()
            pos.x -= mainRect.left
            pos.y -= mainRect.top


            switch(currentTool.getSelected()?.cursor) {
                case 'circle':
                    copyCanvas()
                    context.beginPath()
                    var width = get(toolSettings).width * 0.5 * get(canvasTranslation).scale
                    context.ellipse(pos.x, pos.y, width, width, 0, 0, Math.PI * 2)
                    context.stroke()
                    break
            }
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