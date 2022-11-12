import { toolSettings } from '../lib/stores'
import { get } from 'svelte/store'
import { Draw, Setup } from './SmoothDraw'

var p
var ctx
var drawing = false

export default class Brush {
    displayName = 'Hard Brush'
    name = 'brush'
    icon = 'brush.png'
    cursor = 'circle'
    editingTool = true

    mode = 0
    modeIcons = ['circle.png', 'square.png']

    useEditingLayer = true
    strokeWidth = 20
    opacity = 1
    pressure = true

    color = 'black'


    pointerDown(event, pointer, context) {
        this.saveSettings()

        p = pointer
        ctx = context

        drawing = true
        p.startPointRecording()
        ctx.save()

        ctx.fillStyle = this.color

        var brushTip = (ctx, width) => {
            ctx.beginPath()

            if (this.mode == 0)
                ctx.arc(0, 0, width * 0.5, 0, 2 * Math.PI)
            else
                ctx.rect(-width * 0.5, -width * 0.5, width, width)

            ctx.fill()
        }

        Setup(this.strokeWidth, p, ctx, brushTip)
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
        this.color = get(toolSettings).colors[get(toolSettings).selectedColor]
        this.strokeWidth = get(toolSettings).width
        this.opacity = get(toolSettings).opacity
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