import { Point, PointAdd, PointSubtract, PointMul } from '../src/Point.mjs'
import { Draw, Setup, Reset } from '../src/SmoothDraw.mjs'


export class Pen {
    useEditingLayer = true;
    strokeWidth = 5
    pressure = true
    color = 'black'
    

    pointerDown(event, pointer, ctx) {
        pointer.startPointRecording()       
        
        ctx.save();  
        ctx.lineCap = 'round'
        //ctx.fillStyle = this.color

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