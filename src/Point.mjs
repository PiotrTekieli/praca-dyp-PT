export class Point {
    x = 0
    y = 0
    pressure = 0

    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

export function PointAdd(point1, point2) {
    return new Point(point1.x + point2.x, point1.y + point2.y)
}

export function PointSubtract(point1, point2) {
    return new Point(point1.x - point2.x, point1.y - point2.y)
}

export function PointMul(point, value) {
    return new Point(point.x * value, point.y * value)
}