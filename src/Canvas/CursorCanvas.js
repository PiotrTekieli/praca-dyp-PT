// @ts-nocheck
import { get } from "svelte/store"
import { currentTool, toolSettings, canvasTranslation } from "../lib/stores"
import { Point } from "./Point"

var _main, _base
var canvas
var mainContext
var mousePosition

var tempCanvas
var context

function Resize() {
    let mainRect = _main.getBoundingClientRect()

    canvas.width = mainRect.width
    canvas.height = mainRect.height

    mainContext = canvas.getContext('2d', { antialias: false })
    mainContext.globalCompositeOperation = 'destination-in'
    mainContext.imageSmoothingEnabled = false

    tempCanvas = document.createElement('canvas')
    tempCanvas.width = canvas.width
    tempCanvas.height = canvas.height

    context = tempCanvas.getContext('2d', { antialias: false })
    context.translate(0.5, 0.5)
    context.lineWidth = 0.8
    context.imageSmoothingEnabled = false
}

function copyCanvas() {
    mainContext.save()

    mainContext.globalCompositeOperation = 'copy'
    mainContext.fillStyle = 'white'
    mainContext.fillRect(0, 0, canvas.width, canvas.height)

    mainContext.globalCompositeOperation = 'source-over'

    var canvasState = get(canvasTranslation)
    var mainRect = _main.getBoundingClientRect()

    mainContext.translate(canvasState.left - mainRect.left, canvasState.top - mainRect.top)
    mainContext.rotate(canvasState.rotation * canvasState.flip)
    mainContext.scale(canvasState.scale * canvasState.flip, canvasState.scale)
    mainContext.filter = "invert(1) grayscale(1) contrast(50)"

    mainContext.drawImage(_base, 0, 0)

    mainContext.restore()
}

const cross = document.createElement('canvas')

const crossSize = 5
const crossCenter = 2.5

function cursorCross() {
    cross.width = 11
    cross.height = 11
    var context = cross.getContext('2d', { antialias: false })
    context.translate(0.5, 0.5)
    context.lineWidth = 0.8
    var pos = {x: 5, y: 5}
    context.moveTo(pos.x, pos.y + crossSize)
    context.lineTo(pos.x, pos.y + crossCenter)
    context.moveTo(pos.x + crossSize, pos.y)
    context.lineTo(pos.x + crossCenter, pos.y)
    context.moveTo(pos.x, pos.y - crossSize)
    context.lineTo(pos.x, pos.y - crossCenter)
    context.moveTo(pos.x - crossSize, pos.y)
    context.lineTo(pos.x - crossCenter, pos.y)
    context.stroke()
}

/*function drawCursor() {
    var img = new Image()
    img.src = 'move.png'

    mainContext.save()
    mainContext.globalCompositeOperation = 'source-over'
    mainContext.drawImage(img, mousePosition.x - 5, mousePosition.y - 5)
    mainContext.restore()
}*/


function drawCross() {
    context.drawImage(cross, mousePosition.x - 5, mousePosition.y - 5)
}

function UpdateCursor() {
    switch(get(currentTool)?.cursor) {
        case 'circle':
            context.beginPath()
            var width = get(toolSettings).width * 0.5 * get(canvasTranslation).scale
            context.ellipse(mousePosition.x, mousePosition.y, width, width, 0, 0, Math.PI * 2)
            context.stroke()
            drawCross()
            break
        case 'square':
            context.beginPath()
            var size = get(toolSettings).width * 0.5 * get(canvasTranslation).scale
            context.rect(mousePosition.x - size, mousePosition.y - size, size * 2, size * 2)
            context.stroke()
            drawCross()
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
                    context.beginPath()
                    var width = get(toolSettings).width * 0.5 * get(canvasTranslation).scale
                    context.ellipse(pos.x, pos.y, width, width, 0, 0, Math.PI * 2)
                    context.stroke()
                    break
            }
            break
    }

    copyCanvas()
    mainContext.drawImage(tempCanvas, 0, 0)
    //drawCursor()
    context.clearRect(0, 0, canvas.width, canvas.height)
}

export default {
    setup: (main, base) => {
        _main = main
        _base = base
        canvas = document.createElement('canvas')
        canvas.style.zIndex = "1"

        _main.appendChild(canvas)
        Resize()
        cursorCross()
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