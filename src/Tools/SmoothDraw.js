var begin = true
var beginPoint
var prevPointTop, prevPointBottom
var strokeWidth

export function Setup(width, pointer, ctx) {
    strokeWidth = width
    beginPoint = pointer.position
    ctx.beginPath()        
    ctx.arc(beginPoint.x, beginPoint.y, beginPoint.pressure * strokeWidth, 0, 2 * Math.PI)
    ctx.fill()
}

export function Reset() {
    begin = true;
    beginPoint = null
    prevPointTop = null
    prevPointBottom = null
}

function _getQBezierValue(t, p1, p2, p3) {
    var iT = 1 - t;
    return iT * iT * p1 + 2 * iT * t * p2 + t * t * p3;
}

function getQuadraticCurvePoint(startX, startY, cpX, cpY, endX, endY, position) {
    return {
        x:  _getQBezierValue(position, startX, cpX, endX),
        y:  _getQBezierValue(position, startY, cpY, endY)
    };
}

function lerp(a, b, n) {
    return (1 - n) * a + n * b;
  }

export function Draw(pointer, ctx) {
    
    if (pointer.getPointsLenght() > 2) {
        const lastTwoPoints = pointer.getLastTwoPoints()
        
        const controlPoint = lastTwoPoints[0]
        const lastPoint = lastTwoPoints[1]
        const endPoint = controlPoint.Add(lastPoint).Multiply(0.5) //PointMul(PointAdd(controlPoint, lastPoint), 0.5)     

        const direction = endPoint.Subtract(beginPoint)
        var mag = Math.sqrt(direction.x * direction.x + direction.y * direction.y)
        
        var progress = 0;
        ctx.beginPath()
        
        while(progress < 1) {
            var position = getQuadraticCurvePoint(beginPoint.x, beginPoint.y, controlPoint.x, controlPoint.y, endPoint.x, endPoint.y, progress)
            ctx.arc(position.x, position.y, lerp(beginPoint.pressure, lastPoint.pressure, progress) * strokeWidth, 0, 2 * Math.PI)
            progress += 1 / mag
        }

        ctx.fill();
        beginPoint = endPoint;
        beginPoint.pressure = lastPoint.pressure
    }

    /*if (pointer.getPointsLenght() >= 2 && begin) {
        begin = false;
        const lastTwoPoints = pointer.getLastTwoPoints()
        const lastPoint = lastTwoPoints[1]
        const direction = PointSubtract(lastPoint, beginPoint)
        const controlPoint = PointMul(PointAdd(beginPoint, lastPoint), 0.5) 
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
        ctx.arc(lastPoint.x, lastPoint.y, lastPoint.pressure * strokeWidth, 0, 2 * Math.PI)
        ctx.fill()

        const beginPointUp = PointAdd(beginPoint, PointMul(directionUp, beginPoint.pressure * strokeWidth))
        const beginPointDown = PointAdd(beginPoint, PointMul(directionDown, beginPoint.pressure * strokeWidth))
        const lastPointUp = PointAdd(lastPoint, PointMul(directionUp, lastPoint.pressure * strokeWidth))
        const lastPointDown = PointAdd(lastPoint, PointMul(directionDown, lastPoint.pressure * strokeWidth))   
        
        const controlPointPressure = lastPoint.pressure * strokeWidth
        const controlPointUp = PointAdd(controlPoint, PointMul(directionUp, controlPointPressure))
        const controlPointDown = PointAdd(controlPoint, PointMul(directionDown, controlPointPressure))
        ctx.beginPath()
        ctx.moveTo(beginPointUp.x, beginPointUp.y)
        ctx.quadraticCurveTo(controlPointUp.x, controlPointUp.y, lastPointUp.x, lastPointUp.y)
        ctx.lineTo(lastPointDown.x, lastPointDown.y)
        ctx.quadraticCurveTo(controlPointDown.x, controlPointDown.y, beginPointDown.x, beginPointDown.y)
        ctx.fill()


        prevPointTop = PointAdd(lastPoint, PointMul(directionUp, beginPoint.pressure * strokeWidth))
        prevPointBottom = PointAdd(lastPoint, PointMul(directionDown, beginPoint.pressure * strokeWidth))
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

        const beginPointUp = PointAdd(beginPoint, PointMul(directionUp, beginPoint.pressure * strokeWidth))
        const beginPointDown = PointAdd(beginPoint, PointMul(directionDown, beginPoint.pressure * strokeWidth))

        const controlPointPressure = (beginPoint.pressure + lastPoint.pressure) * 0.5 * strokeWidth
        const controlPointUp = PointAdd(controlPoint, PointMul(directionUp, controlPointPressure))
        const controlPointDown = PointAdd(controlPoint, PointMul(directionDown, controlPointPressure))
        
        const endPointUp = PointAdd(endPoint, PointMul(directionUp, lastPoint.pressure * strokeWidth))
        const endPointDown = PointAdd(endPoint, PointMul(directionDown, lastPoint.pressure * strokeWidth))                                  

        if (prevPointTop) {
            ctx.beginPath()
            ctx.moveTo(prevPointTop.x, prevPointTop.y)
            ctx.lineTo(beginPointUp.x, beginPointUp.y)
            ctx.quadraticCurveTo(controlPointUp.x, controlPointUp.y, endPointUp.x, endPointUp.y)
            //ctx.arcTo(endPoint.x + normalDirection.x * 200, endPoint.y + normalDirection.y * 200, endPointDown.x, endPointDown.y, lastPoint.pressure * strokeWidth)
            ctx.lineTo(endPointDown.x, endPointDown.y)
            ctx.quadraticCurveTo(controlPointDown.x, controlPointDown.y, beginPointDown.x, beginPointDown.y) 
            ctx.lineTo(prevPointBottom.x, prevPointBottom.y)
            ctx.fill()

            ctx.beginPath()        
            ctx.arc(endPoint.x, endPoint.y, lastPoint.pressure * strokeWidth, 0, 2 * Math.PI)
            ctx.fill()
        }
        
        beginPoint = endPoint;
        beginPoint.pressure = lastPoint.pressure;
        prevPointTop = PointAdd(endPoint, PointMul(directionUp, lastPoint.pressure * strokeWidth))
        prevPointBottom = PointAdd(endPoint, PointMul(directionDown, lastPoint.pressure * strokeWidth))
    }*/
}
