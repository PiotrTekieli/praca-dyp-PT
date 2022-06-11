var beginPoint;

export class Eraser {
    useEditingLayer = false;
    strokeWidth = 25
    pressure = true
    color = null

    pointerDown(event, pointer, ctx) {
        pointer.startPointRecording()
        beginPoint = pointer.position
    }

    pointerMove(event, pointer, ctx) {
        if (event.pressure) {
            
            
            if (pointer.getPointsLenght() > 3) {
                const lastTwoPoints = pointer.getLastTwoPoints()
                const controlPoint = lastTwoPoints[0];
                const endPoint = {
                    x: (lastTwoPoints[0].x + lastTwoPoints[1].x) / 2,
                    y: (lastTwoPoints[0].y + lastTwoPoints[1].y) / 2,
                }

                ctx.beginPath();
                ctx.moveTo(beginPoint.x, beginPoint.y)
                //ctx.lineTo(pointer.newPos.x, pointer.newPos.y)
                ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y);
                ctx.lineCap = 'round';
                ctx.globalCompositeOperation = 'destination-out'
                ctx.lineWidth = this.strokeWidth * (this.pressure ? event.pressure : 1);
                ctx.stroke();

                beginPoint = endPoint;                
            }
            return true;
        }
    }

    pointerUp(event, pointer, ctx) {
        pointer.clearPoints()
    }

    changeColor(color) {
        this.color = color;
    }
}