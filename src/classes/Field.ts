import Camera from './Camera.ts';
import { batchCircle } from '../util/Draw.ts';
import Particle from './Particle.ts';
import Red from './Red.ts';
import Blue from './Blue.ts';
import Vector2 from './Vector2.ts';

const spacing = 20;
const radius = 1;
const bendFactor = 20;
const padding = 20;

const getScreenSpace = (x: number, y: number, camera: Camera) => {
    return new Vector2(
        x * spacing + camera.x % spacing,
        y * spacing + camera.y % spacing,
    );
}

class Field {
    constructor() {}

    sampleEMF(x: number, y: number, particles: Particle[], camera: Camera, physicsParams: Record<string, any>) {
        const res = new Vector2();
        const dummyParticle = new Blue(x - camera.x, y - camera.y);
        for(const particle of particles) {
            const EMF = particle.getElectromagneticForce(dummyParticle, physicsParams);
            res.add(EMF);
        }
        return res;
    }

    sampleSNF(x: number, y: number, particles: Particle[], camera: Camera) {
        const res = new Vector2();
        const dummyParticle = new Red(x - camera.x, y - camera.y);
        for(const particle of particles) {
            const SNF = particle.getStrongNuclearForce(dummyParticle);
            res.add(SNF);
        }
        return res;
    }

    display(canvas: HTMLCanvasElement, camera: Camera, particles: Particle[], physicsParams: Record<string, any>) {
        const ctx = canvas.getContext('2d');
        if(!ctx) return;

        const resolutionX = canvas.width / spacing;
        const resolutionY = canvas.height / spacing;

        ctx.beginPath();
        for(let i = -padding; i < resolutionY+padding; i++) {
            for(let j = -padding; j < resolutionX+padding; j++) {
                const pos = getScreenSpace(j, i, camera);
                const EMF = this.sampleEMF(pos.x, pos.y, particles, camera, physicsParams);
                EMF.mult(bendFactor);

                batchCircle(
                    pos.x + EMF.x,
                    pos.y + EMF.y,
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
