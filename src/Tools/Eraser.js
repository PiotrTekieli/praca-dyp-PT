import { Draw, Setup } from './SmoothDraw'

var p
var ctx
var drawing = false

export default class Eraser {
    name = 'eraser'
    icon = 'favicon.ico'
    useEditingLayer = false;
    strokeWidth = 50
    pressure = true


    pointerDown(event, pointer, context) {
        p = pointer
        ctx = context

        p.startPointRecording()

        ctx.save();
        ctx.globalCompositeOperation = "destination-out"

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
}