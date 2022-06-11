var points = []
var pointRecording = false

export class Pointer {
   

    oldPos = {
        x: 0,
        y: 0
    }
    position = {
        x: 0,
        y: 0
    }

    set(e, ctx) {
        var rect = ctx.canvas.getBoundingClientRect();
        var position = ({ x: e.pageX - rect.left, y: e.pageY - rect.top })
        
        this.position = position;

        if (pointRecording) {
            points.push(this.position);
            if (points.length > 10) {
                points = points.slice(-10);
            }
            
        }

        //console.table([this.oldPos, this.newPos])
    }

    getPointsLenght() {
        return points.length
    }

    getLastTwoPoints() {
        return points.slice(-2)
    }

    startPointRecording() {
        pointRecording = true;
    }

    clearPoints() {
        points = []
        pointRecording = false;
    }

}