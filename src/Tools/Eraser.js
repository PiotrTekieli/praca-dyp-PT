import { toolSettings } from '../lib/stores'
import { get } from 'svelte/store'
import { Draw, Setup } from './SmoothDraw'

var p
var ctx
var drawing = false

export default class Eraser {
    displayName = 'Hard Round Eraser'
    name = 'eraser'
    icon = 'eraser.png'
    useEditingLayer = false;
    strokeWidth = 50
    mode = 1
    modeIcons = ['circle.png', 'square.png']
    pressure = true


    pointerDown(event, pointer, context) {
        this.saveSettings()

        p = pointer
        ctx = context

        p.startPointRecording()

        ctx.save();
        ctx.globalCompositeOperation = "destination-out"

        var penTip = (ctx, width) => {
            ctx.beginPath()

            if (this.mode == 1)
                ctx.arc(0, 0, width * 0.5, 0, 2 * Math.PI)
            else
                ctx.rect(-width * 0.5, -width * 0.5, width, width)


            ctx.fill()
        }

        Setup(this.strokeWidth, p, ctx, penTip)
        drawing = true
    }

    pointerMove(event) {
        if (drawing)
            Draw()
    }

    pointerUp(event) {
        return this.cancel()
    }

    cancel() {
        p?.clearPoints()
        ctx?.restore()

        p = null
        ctx = null
        if (drawing) {
            drawing = false
            return true
        }
    }

    saveSettings() {
        this.strokeWidth = get(toolSettings).width
        this.mode = get(toolSettings).mode
    }
}