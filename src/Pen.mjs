export class Pen {
    strokeWidth = 15
    pressure = true
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
        }
    }

    changeColor(color) {
        this.color = color;
    }
}