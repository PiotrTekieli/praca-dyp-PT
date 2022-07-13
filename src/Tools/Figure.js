import { toolSettings } from '../lib/stores'
import { get } from 'svelte/store'

var p
var ctx
var drawing = false
var beginPoint

export default class Figure {
    displayName = 'Figure Tool'
    name = 'figure'
    icon = 'favicon.ico'
    useEditingLayer = true;
    strokeWidth = 20
    opacity = 1
    mode = 1
    modeIcons = ['favicon.ico', 'favicon.ico', 'favicon.ico']
    pressure = false
    color = 'black'


    pointerDown(event, pointer, context) {
        this.saveSettings()

        p = pointer
        ctx = context

        ctx.save();
        ctx.strokeStyle = this.color
        ctx.lineWidth = this.strokeWidth
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.globalCompositeOperation = 'copy'

        drawing = true
        beginPoint = p.position
    }

    pointerMove(event) {
        if (drawing) {
            switch(this.mode) {
                case 1:
                    ctx.beginPath()
                    ctx.moveTo(beginPoint.x, beginPoint.y)
                    ctx.lineTo(p.position.x, p.position.y)
                    ctx.stroke()
                    break
                case 2:
                    var difference = p.position.Subtract(beginPoint)
                    ctx.strokeRect(beginPoint.x, beginPoint.y, difference.x, difference.y)
                    break
                case 3:
                    var difference = p.position.Subtract(beginPoint).Multiply(0.5)
                    ctx.beginPath()
                    ctx.ellipse(beginPoint.x + difference.x, beginPoint.y + difference.y, Math.abs(difference.x), Math.abs(difference.y), 0, Math.PI * 2, 0)
                    ctx.stroke()
                    break
            }
        }
    }

    pointerUp(event) {
        return this.cancel()
    }

    cancel() {
        if (drawing) {
            ctx.restore()

            p = null
            ctx = null
            drawing = false
            return true
        }
    }

    saveSettings() {
        this.color = get(toolSettings).colors[get(toolSettings).selectedColor]
        this.strokeWidth = get(toolSettings).width
        this.opacity = get(toolSettings).opacity
        this.mode = get(toolSettings).mode
    }
}