export class Eraser {
    strokeWidth = 20
    pressure = false
    color = null

    pointerDown(event, pointer, paper) {
        
    }

    pointerMove(event, pointer, paper) {
        if (event.pressure) {
            var path = new paper.Path();

            path.add(new paper.Point(pointer.oldPos.x, pointer.oldPos.y))
            path.add(new paper.Point(pointer.newPos.x, pointer.newPos.y))
            
            path.strokeWidth = this.strokeWidth * (this.pressure ? event.pressure : 1)
            path.strokeCap = 'round'
            path.strokeColor = new paper.Color(0,1)
            path.blendMode = 'destination-out'
        }
    }

    changeColor(color) {
        this.color = color;
    }
}