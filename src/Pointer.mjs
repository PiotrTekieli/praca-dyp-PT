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

        var canvasSize = {
            x: (rect.right - rect.left) / 2, 
            y: (rect.bottom - rect.top) / 2
        }
        
        var degrees = -0
        var x = degrees * (Math.PI/180);
    
        var newX = canvasSize.x + (position.x - canvasSize.x) * Math.cos(x) - (position.y - canvasSize.y)*Math.sin(x)
        newX = newX - (canvasSize.x - 300)
        var newY =  canvasSize.y + (position.x- canvasSize.x) * Math.sin(x) + (position.y- canvasSize.y)*Math.cos(x);
        newY = newY - (canvasSize.y - 300)
        
        //console.log("Translated: ", newX, newY)
        
        position = new Point(newX, newY)


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