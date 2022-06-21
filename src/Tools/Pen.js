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
        var sourceCanvas = document.createElement('canvas')
        sourceCanvas.width = this.strokeWidth
        sourceCanvas.height = this.strokeWidth
        var c = sourceCanvas.getContext('2d')
        var radius = this.strokeWidth / 2
        c.arc(radius, radius, radius, 0, 2 * Math.PI)
        c.fill()



        Setup(this.strokeWidth, p, ctx, sourceCanvas)
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