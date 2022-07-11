import { toolSettings } from '../lib/stores'
import { get } from 'svelte/store'
import { Draw, Setup } from './SmoothDraw'

var p
var ctx
var drawing = false

export default class Pen {
    displayName = 'Hard Round Pen'
    name = 'pen'
    icon = 'favicon.ico'
    useEditingLayer = true;
    strokeWidth = 20
    opacity = 1
    pressure = true
    color = 'black'


    pointerDown(event, pointer, context) {
        this.saveSettings()
        this.color = get(toolSettings).colors[get(toolSettings).selectedColor]

        p = pointer
        ctx = context

        p.startPointRecording()

        ctx.save();
        ctx.fillStyle = this.color

        Setup(this.strokeWidth, p, ctx)
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
        this.opacity = get(toolSettings).opacity
    }
}