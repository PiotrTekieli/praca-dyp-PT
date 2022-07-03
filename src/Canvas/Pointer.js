import { Point } from "./Point";
import { canvasTranslation } from "../lib/stores";
import { get } from "svelte/store";

var points = []
var pointRecording = false
var ctx

var canvasSize

export default class Pointer {
    constructor(canvas, size) {
        ctx = canvas.getContext('2d')
        canvasSize = size
    }
    oldPos = {  // not needed
        x: 0,
        y: 0
    }
    position = {
        x: 0,
        y: 0
    }

    set(e) {
        var rect = ctx.canvas.getBoundingClientRect();
        var position = new Point(
            e.pageX - rect.left,
            e.pageY - rect.top
        )

        var canvasRectSize = {
            x: (rect.right - rect.left) / 2,
            y: (rect.bottom - rect.top) / 2
        }

        var canvasState = get(canvasTranslation)

        var degrees = -canvasState.rotation * canvasState.flip
        var rad = degrees * (Math.PI/180);

        var newX = canvasRectSize.x + (position.x - canvasRectSize.x) * Math.cos(rad) - (position.y - canvasRectSize.y) * Math.sin(rad)
        var newY =  canvasRectSize.y + (position.x- canvasRectSize.x) * Math.sin(rad) + (position.y- canvasRectSize.y) * Math.cos(rad);

        newX = newX - (canvasRectSize.x - canvasSize.x * 0.5 * canvasState.scale)
        newY = newY - (canvasRectSize.y - canvasSize.y * 0.5 * canvasState.scale)


        position = new Point(newX, newY)
        position = position.Multiply(1 / canvasState.scale)
        if (canvasState.flip < 0)
            position.x = canvasSize.x - position.x

        position.pressure = e.pressure !== 0.5 ? e.pressure : 1;
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