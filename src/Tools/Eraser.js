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
    cursor = 'circle'
    editingTool = true

    mode = 0
    modeIcons = ['circle.png', 'square.png']

    useEditingLayer = false
    strokeWidth = 50
    pressure = true


    pointerDown(event, pointer, context) {
        this.saveSettings()

        p = pointer
        ctx = context

        drawing = true
        p.startPointRecording()
        ctx.save();

        ctx.globalCompositeOperation = "destination-out"

        var penTip = (ctx, width) => {
            ctx.beginPath()

            if (this.mode == 0)
                ctx.arc(0, 0, width * 0.5, 0, 2 * Math.PI)
            else
                ctx.rect(-width * 0.5, -width * 0.5, width, width)


            ctx.fill()
        }

        Setup(this.strokeWidth, p, ctx, penTip)
    }

    pointerMove(event) {
        if (drawing)
            Draw()
    }

    pointerUp(event) {
        return this.cancel()
    }

    cancel() {
        if (drawing) {
            p.clearPoints()
            ctx.restore()

            p = null
            ctx = null

            drawing = false
            return true
        }
    }

    saveSettings() {
        this.strokeWidth = get(toolSettings).width
        this.mode = get(toolSettings).mode
    }

    switchMode(mode) {
        this.mode = mode
        if (this.mode == 0)
            this.cursor = 'circle'
        else
            this.cursor = 'square'
    }
}