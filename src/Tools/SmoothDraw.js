var beginPoint
var strokeWidth

export function Setup(width, pointer, ctx) {
    strokeWidth = width
    beginPoint = pointer.position
    ctx.beginPath()        
    ctx.arc(beginPoint.x, beginPoint.y, beginPoint.pressure * strokeWidth, 0, 2 * Math.PI)
    ctx.fill()
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

}
