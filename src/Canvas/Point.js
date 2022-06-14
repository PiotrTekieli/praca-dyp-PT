export class Point {
    x = 0
    y = 0
    pressure = 0

    constructor(x, y) {
        this.x = x
        this.y = y
    }

    Multiply(value) {
        return new Point(this.x * value, this.y * value)
    }

    Add(point) {
        return new Point(this.x + point.x, this.y + point.y)
    }

    Subtract(point) {
        return new Point(this.x - point.x, this.y - point.y)
    }
}