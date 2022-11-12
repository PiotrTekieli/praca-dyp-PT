// @ts-nocheck
import { get } from "svelte/store"
import { currentTool, toolSettings, canvasTranslation, layerList } from "../lib/stores"
import { Point } from "./Point"

var _main, _base
var mainCanvas
var mainCtx
var mousePosition

var memoryCanvas
var memoryCtx

var cursorList

function Resize() {
    let mainRect = _main.getBoundingClientRect()

    mainCanvas.width = mainRect.width
    mainCanvas.height = mainRect.height

    mainCtx = mainCanvas.getContext('2d')
    mainCtx.globalCompositeOperation = 'destination-in'
    mainCtx.imageSmoothingEnabled = false

    memoryCanvas = document.createElement('canvas')
    memoryCanvas.width = mainCanvas.width
    memoryCanvas.height = mainCanvas.height

    memoryCtx = memoryCanvas.getContext('2d', { antialias: false })
    memoryCtx.translate(0.5, 0.5)
    memoryCtx.lineWidth = 0.8
    memoryCtx.strokeStyle = 'white'
    memoryCtx.imageSmoothingEnabled = false
}

function copyCanvas() {
    mainCtx.save()

    mainCtx.globalCompositeOperation = 'copy'
    mainCtx.fillStyle = 'white'
    mainCtx.fillRect(0, 0, mainCanvas.width, mainCanvas.height)

    mainCtx.globalCompositeOperation = 'source-over'

    var canvasState = get(canvasTranslation)
    var mainRect = _main.getBoundingClientRect()

    mainCtx.translate(canvasState.left - mainRect.left, canvasState.top - mainRect.top)
    mainCtx.rotate(canvasState.rotation * canvasState.flip)
    mainCtx.scale(canvasState.scale * canvasState.flip, canvasState.scale)
    mainCtx.filter = "invert(1) grayscale(1) contrast(1000)"

    mainCtx.drawImage(_base, 0, 0)

    mainCtx.restore()
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

function drawCursor(cursor) {
    if (!cursor)
        return

    if (mousePosition.x >= 0 && mousePosition.x <= mainCanvas.width && mousePosition.y >= 0 && mousePosition.y <= mainCanvas.height) {
        mainCtx.save()
        mainCtx.globalCompositeOperation = 'source-over'
        mainCtx.drawImage(cursorList[cursor], mousePosition.x - 25, mousePosition.y - 25)
        mainCtx.restore()
    }
}


function drawCross() {
    memoryCtx.drawImage(cross, mousePosition.x - 5, mousePosition.y - 5)
}

function UpdateCanvas() {
    let cursor = false

    switch(get(currentTool)?.cursor) {
        case 'cross':
            drawCross()
            break
        case 'circle':
            memoryCtx.beginPath()
            var width = get(toolSettings).width * 0.5 * get(canvasTranslation).scale
            memoryCtx.ellipse(mousePosition.x, mousePosition.y, width, width, 0, 0, Math.PI * 2)
            memoryCtx.stroke()
            drawCross()
            break
        case 'square':
            memoryCtx.beginPath()
            var size = get(toolSettings).width * 0.5 * get(canvasTranslation).scale
            memoryCtx.rect(mousePosition.x - size, mousePosition.y - size, size * 2, size * 2)
            memoryCtx.stroke()
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
                    memoryCtx.beginPath()
                    var width = get(toolSettings).width * 0.5 * get(canvasTranslation).scale
                    memoryCtx.ellipse(pos.x, pos.y, width, width, 0, 0, Math.PI * 2)
                    memoryCtx.stroke()
                    break
                case 'square':
                    memoryCtx.beginPath()
                    var size = get(toolSettings).width * 0.5 * get(canvasTranslation).scale
                    memoryCtx.rect(pos.x - size, pos.y - size, size * 2, size * 2)
                    memoryCtx.stroke()
                    break
            }
            break
        default:
            cursor = get(currentTool)?.mouseCursor
    }

    if (layerList.isEmpty() && get(currentTool)?.editingTool) {
        mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height)
        drawCursor("not_allowed")
        memoryCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height)
        return
    }


    copyCanvas()
    /*mainCtx.globalCompositeOperation = 'copy'
    mainCtx.fillStyle = 'white'
    mainCtx.fillRect(0, 0, mainCanvas.width, mainCanvas.height)*/

    //mainCtx.globalCompositeOperation = 'copy'

    mainCtx.drawImage(memoryCanvas, 0, 0)

    drawCursor(get(currentTool)?.mouseCursor)

    memoryCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height)
}

export default {
    setup: (main, base) => {
        _main = main
        _base = base
        mainCanvas = document.createElement('canvas')
        mainCanvas.style.zIndex = "1"

        _main.appendChild(mainCanvas)
        Resize()
        cursorCross()

        cursorList = {
            arrow: new Image(),
            ew_resize: new Image(),
            grab: new Image(),
            grabbing: new Image(),
            zoom_in: new Image(),
            not_allowed: new Image()
        }

        for (var cursor in cursorList) {
            cursorList[cursor].src = `cursors/${cursor}.png`
        }
    },
    update: (e = null) => {
        if (_main == null)
            return

        if (e) {
            var rect = _main.getBoundingClientRect()
            mousePosition = new Point(e.pageX - rect.left, e.pageY - rect.top)
        }
        if (mousePosition)
            UpdateCanvas()
    },
    clear: () => {
        memoryCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height)
    },
    resize: () => {
        Resize()
    }
}