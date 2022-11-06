export class Layer {
    name = "New Layer"
    canvas
    context
    opacity = 1
    blendMode = 'source-over'

    constructor(canvasSize) {
        var canvas = document.createElement("canvas")
        canvas.width = canvasSize.x
        canvas.height = canvasSize.y
        canvas.getContext('2d').imageSmoothingEnabled = false
        this.canvas = canvas
        this.context = canvas.getContext('2d')
    }
}