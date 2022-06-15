import { Draw, Setup } from './SmoothDraw'

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
        this.cancel(pointer, ctx)        
    }

    cancel(pointer, ctx) {
        pointer.clearPoints()
        ctx.restore()
    }

    changeColor(color) {
        this.color = color;
    }
}