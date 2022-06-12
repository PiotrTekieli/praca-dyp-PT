import { Point } from "./Point.mjs";

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
        var position = new Point(
            e.pageX - rect.left,
            e.pageY - rect.top 
        )
        position.pressure = e.pressure;        
        this.position = position;
        

        if (pointRecording) {
            points.push(this.position);
            if (points.length > 10) {
                points = points.slice(-3);
            }
            
        }

        //console.table([this.oldPos, this.newPos])
    }

    getPointsLenght() {
        return points.length
    }

    getLastTwoPoints() {
        return points.slice(-3)
    }

    startPointRecording() {
        pointRecording = true;
    }

    clearPoints() {
        points = []
        pointRecording = false;
    }

}