export class Pointer {
    oldPos = {
        x: 0,
        y: 0
    }
    newPos = {
        x: 0,
        y: 0
    }

    set(position) {
        this.oldPos = this.newPos;
        this.newPos = position;
        //console.table([this.oldPos, this.newPos])
    }

}