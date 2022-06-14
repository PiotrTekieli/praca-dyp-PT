export class Layer {
    canvas
    context
    opacity = 1

    constructor(canvas) {
        this.canvas = canvas
        this.context = canvas.getContext('2d')
    }
}