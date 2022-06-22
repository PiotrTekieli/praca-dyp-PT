import { Draw, Setup } from './SmoothDraw'

var p
var ctx

export default class Eraser {
    drawing = false
    useEditingLayer = false;
    strokeWidth = 50
    pressure = true
    color = null


    pointerDown(event, pointer, context) {
        p = pointer
        ctx = context

        p.startPointRecording()

        ctx.save();
        ctx.globalCompositeOperation = "destination-out"

        /*var sourceCanvas = document.createElement('canvas')
        sourceCanvas.width = this.strokeWidth
        sourceCanvas.height = this.strokeWidth
        var c = sourceCanvas.getContext('2d')
        var radius = this.strokeWidth * 0.5
        c.arc(radius, radius, radius, 0, 2 * Math.PI)
        c.fill()*/

        Setup(this.strokeWidth, p, ctx)
        this.drawing = true
    }

    pointerMove(event) {
        if (this.drawing)
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
        if (this.drawing) {
            this.drawing = false
            return true
        }
    }

    changeColor(color) {
        this.color = color;
    }
}