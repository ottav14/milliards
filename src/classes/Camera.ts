import { lerp } from '../util/Math.ts';

const smoothingRate = 0.5;

class Camera {
    x: number;
    y: number;
    desiredX: number;
    desiredY: number;
    constructor() {
        this.x = 0;
        this.y = 0;
        this.desiredX = 0;
        this.desiredY = 0;
    }

    pan(e: MouseEvent) {
        this.desiredX += e.movementX;
        this.desiredY += e.movementY;
    }

    update() {
        this.x = lerp(this.x, this.desiredX, smoothingRate);
        this.y = lerp(this.y, this.desiredY, smoothingRate);
    }
}
export default Camera;
