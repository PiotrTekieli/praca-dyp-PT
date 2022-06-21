import { Draw, Setup } from './SmoothDraw'

var p
var ctx

export default class Pen {
    drawing = false
    useEditingLayer = true;
    strokeWidth = 20
    pressure = true
    color = 'black'


    pointerDown(event, pointer, context) {
        p = pointer
        ctx = context

        p.startPointRecording()

        ctx.save();
        ctx.lineCap = 'round'
        //ctx.fillStyle = this.color

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
            return false
        }
    }

    changeColor(color) {
        this.color = color;
    }
}