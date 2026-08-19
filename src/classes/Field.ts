import Camera from './Camera.ts';
import { batchCircle } from '../util/Draw.ts';
import Particle from './Particle.ts';
import Vector2 from './Vector2.ts';

const spacing = 20;
const radius = 1;
const bendFactor = 20;
const padding = 20;

// The field is visualized by probing it with an electron's charge.
const probeCharge = -1;

// Reused across every grid sample so the render loop stays allocation-free.
const sample = new Vector2();

class Field {
    constructor() {}

    sampleEMF(out: Vector2, x: number, y: number, particles: Particle[], camera: Camera, physicsParams: Record<string, any>) {
        out.x = 0;
        out.y = 0;
        const worldX = x - camera.x;
        const worldY = y - camera.y;
        for(const particle of particles)
            particle.addElectromagneticForceAt(out, worldX, worldY, probeCharge, physicsParams);
    }

    display(canvas: HTMLCanvasElement, camera: Camera, particles: Particle[], physicsParams: Record<string, any>) {
        const ctx = canvas.getContext('2d');
        if(!ctx) return;

        const resolutionX = canvas.width / spacing;
        const resolutionY = canvas.height / spacing;
        const offsetX = camera.x % spacing;
        const offsetY = camera.y % spacing;

        ctx.beginPath();
        for(let i = -padding; i < resolutionY+padding; i++) {
            const y = i * spacing + offsetY;
            for(let j = -padding; j < resolutionX+padding; j++) {
                const x = j * spacing + offsetX;

                this.sampleEMF(sample, x, y, particles, camera, physicsParams);

                batchCircle(
                    x + sample.x * bendFactor,
                    y + sample.y * bendFactor,
                    radius,
                    ctx
                );
            }
        }
        ctx.fillStyle = '#545454';
        ctx.fill();
    }

}
export default Field;
