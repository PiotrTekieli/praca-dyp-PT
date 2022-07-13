import { canvasTranslation } from "../lib/stores"
import { get } from "svelte/store"


var beginPoint
var strokeWidth
var pointer
var ctx
var brushTip
var progress = 0

export function Setup(width, p, context, brushFunction) {
    strokeWidth = width
    pointer = p
    ctx = context
    brushTip = brushFunction

    beginPoint = pointer.position
    /*ctx.save()
    ctx.translate(beginPoint.x, beginPoint.y)
    ctx.rotate(-get(canvasTranslation).rotation)
    ctx.globalAlpha = beginPoint.pressure
    brushTip?.(ctx, beginPoint.pressure * strokeWidth)
    ctx.restore()*/
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

export function Draw() {
    console.log(pointer.getLastTwoPoints())

    if (pointer.getPointsLenght() > 2) {
        const lastTwoPoints = pointer.getLastTwoPoints()

        const controlPoint = lastTwoPoints[0]
        const lastPoint = lastTwoPoints[1]
        const endPoint = controlPoint.Add(lastPoint).Multiply(0.5)

        const direction = endPoint.Subtract(beginPoint)
        var mag = Math.sqrt(direction.x * direction.x + direction.y * direction.y)

        while(progress < 1) {
            var position = getQuadraticCurvePoint(beginPoint.x, beginPoint.y, controlPoint.x, controlPoint.y, endPoint.x, endPoint.y, progress)
            ctx.save()
            ctx.translate(position.x, position.y)
            ctx.rotate(-get(canvasTranslation).rotation)
            //ctx.globalAlpha = 0.1//lerp(beginPoint.pressure, lastPoint.pressure, progress)
            brushTip?.(ctx, lerp(beginPoint.pressure, lastPoint.pressure, progress) * strokeWidth)
            ctx.restore()
            //ctx.arc(position.x, position.y, lerp(beginPoint.pressure, lastPoint.pressure, progress) * strokeWidth * 0.5, 0, 2 * Math.PI)

            if (mag != 0)
                progress += 1 / mag
            else progress++
        }
        progress--

        if (progress > 1)
            progress = 0

        beginPoint = endPoint;
        beginPoint.pressure = lastPoint.pressure
    }

}
