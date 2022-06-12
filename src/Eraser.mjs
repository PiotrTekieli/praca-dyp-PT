import { Point, PointAdd, PointSubtract, PointMul } from '../src/Point.mjs'
import { Draw, Setup, Reset } from '../src/SmoothDraw.mjs'

var begin = true
var beginPoint;
var prevPointTop;
var prevPointBottom;

export class Eraser {
    useEditingLayer = false;
    strokeWidth = 50
    pressure = true
    color = null


    pointerDown(event, pointer, ctx) {
        pointer.startPointRecording()       
        
        ctx.save();  
        ctx.lineCap = 'round'
        ctx.globalCompositeOperation = "destination-out"
        ctx.fillStyle = this.color

        Setup(this.strokeWidth, pointer, ctx)
    }

    pointerMove(event, pointer, ctx) {
        if (event.pressure) {
            Draw(pointer, ctx)
        }
    }

    pointerUp(event, pointer, ctx) {
        Reset()
        pointer.clearPoints()
        ctx.restore()
    }

    changeColor(color) {
        this.color = color;
    }
}