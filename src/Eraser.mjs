import { Point, PointAdd, PointSubtract, PointMul } from '../src/Point.mjs'

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
        beginPoint = pointer.position
        ctx.save()
        ctx.lineCap = 'round'
        ctx.globalCompositeOperation = "destination-out"
    }

    pointerMove(event, pointer, ctx) {
        if (event.pressure) {
            if (pointer.getPointsLenght() == 2) {
                const lastTwoPoints = pointer.getLastTwoPoints()
                const lastPoint = lastTwoPoints[1]
                const direction = PointSubtract(lastPoint, beginPoint)

                var mag = Math.sqrt(direction.x * direction.x + direction.y * direction.y)

                const normalDirection = new Point(
                    direction.x / mag,
                    direction.y / mag
                )

                const directionUp = new Point(
                    -normalDirection.y,
                    normalDirection.x
                )

                const directionDown = new Point(
                    normalDirection.y,
                    -normalDirection.x
                )
                
                ctx.beginPath()        
                ctx.arc(lastPoint.x, lastPoint.y, lastPoint.pressure * this.strokeWidth, 0, 2 * Math.PI)
                ctx.fill()
                prevPointTop = PointAdd(lastPoint, PointMul(directionUp, beginPoint.pressure * this.strokeWidth))
                prevPointBottom = PointAdd(lastPoint, PointMul(directionDown, beginPoint.pressure * this.strokeWidth))
                beginPoint = lastPoint;
            }
            if (pointer.getPointsLenght() > 3) {
                const lastTwoPoints = pointer.getLastTwoPoints()
                
                const controlPoint = lastTwoPoints[0]
                const lastPoint = lastTwoPoints[1]
                const endPoint = PointMul(PointAdd(controlPoint, lastPoint), 0.5)                

                const direction = PointSubtract(endPoint, beginPoint)

                var mag = Math.sqrt(direction.x * direction.x + direction.y * direction.y)

                const normalDirection = new Point(
                    direction.x / mag,
                    direction.y / mag
                )

                const directionUp = new Point(
                    -normalDirection.y,
                    normalDirection.x
                )

                const directionDown = new Point(
                    normalDirection.y,
                    -normalDirection.x
                )

                const beginPointUp = PointAdd(beginPoint, PointMul(directionUp, beginPoint.pressure * this.strokeWidth))
                const beginPointDown = PointAdd(beginPoint, PointMul(directionDown, beginPoint.pressure * this.strokeWidth))
                const controlPointUp = PointAdd(controlPoint, PointMul(directionUp, (beginPoint.pressure + lastPoint.pressure) * 0.5 * this.strokeWidth))
                const controlPointDown = PointAdd(controlPoint, PointMul(directionDown, (beginPoint.pressure + lastPoint.pressure) * 0.5 * this.strokeWidth))
                const endPointUp = PointAdd(endPoint, PointMul(directionUp, lastPoint.pressure * this.strokeWidth))
                const endPointDown = PointAdd(endPoint, PointMul(directionDown, lastPoint.pressure * this.strokeWidth))                                  

                if (prevPointTop) {
                    ctx.beginPath()
                    ctx.moveTo(prevPointTop.x, prevPointTop.y)
                    ctx.lineTo(beginPointUp.x, beginPointUp.y)
                    ctx.quadraticCurveTo(controlPointUp.x, controlPointUp.y, endPointUp.x, endPointUp.y)
                    //ctx.arcTo(endPoint.x + normalDirection.x * 200, endPoint.y + normalDirection.y * 200, endPointDown.x, endPointDown.y, lastPoint.pressure * this.strokeWidth)
                    ctx.lineTo(endPointDown.x, endPointDown.y)
                    ctx.quadraticCurveTo(controlPointDown.x, controlPointDown.y, beginPointDown.x, beginPointDown.y) 
                    ctx.lineTo(prevPointBottom.x, prevPointBottom.y)
                    ctx.fill()

                    ctx.beginPath()        
                    ctx.arc(endPoint.x, endPoint.y, lastPoint.pressure * this.strokeWidth, 0, 2 * Math.PI)
                    ctx.fill()
                }
                
                beginPoint = endPoint;
                beginPoint.pressure = lastPoint.pressure;
                prevPointTop = PointAdd(endPoint, PointMul(directionUp, lastPoint.pressure * this.strokeWidth))
                prevPointBottom = PointAdd(endPoint, PointMul(directionDown, lastPoint.pressure * this.strokeWidth))
            }
        }
    }


    pointerUp(event, pointer, ctx) {
        pointer.clearPoints()
        ctx.restore()
        beginPoint = null
        prevPointTop = null
        prevPointBottom = null
    }

    changeColor(color) {
        this.color = color;
    }
}