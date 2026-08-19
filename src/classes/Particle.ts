import Camera from './Camera.ts';
import { fillCircle, strokeCircle } from '../util/Draw.ts';
import { smoothstep } from '../util/Math.ts';
import Vector2 from './Vector2.ts';
import * as VECTOR2 from './Vector2.ts';

const strongNuclearStrength = 0.1;
const exclusionStrength = 0.01;
const dragRate = 0.9;
const maxAcc = 5;

const computeChargeInteraction = (a: number, b: number) => {
    const product = a*b;
    if(product == 0) return 0;
    return -Math.sign(product);
}

class Particle {
    pos: Vector2;
    vel: Vector2;
    acc: Vector2;
    m: number;
    color: string;
    borderColor: string;
    electromagneticCharge: number;
    strongNuclearCharge: number;
    strongNuclearRange: number;
    constructor(x: number, y: number) {
        this.pos = new Vector2(x, y);
        this.vel = new Vector2();
        this.acc = new Vector2();
        this.m = 50;
        this.color = '#ff0';
        this.borderColor = '#ff0';
        this.electromagneticCharge = 0;
        this.strongNuclearCharge = 0;
        this.strongNuclearRange = this.m*3.5;
    }

    display(canvas: HTMLCanvasElement, camera: Camera, displayParams: Record<string, any>, physicsParams: Record<string, any>) {
        const ctx = canvas.getContext('2d');
        if(!ctx) return;
        const x = this.pos.x + camera.x;
        const y = this.pos.y + camera.y;
        const delta = physicsParams['electromagneticRange'] + 10;
        if(x < -delta || x > canvas.width+delta || y < -delta || y > canvas.height+delta)
            return;

        if(displayParams['minimalParticles']) {
            ctx.strokeStyle = this.borderColor;
            ctx.lineWidth = 2;
            strokeCircle(
                x,
                y,
                this.m-2,
                ctx 
            );
        }
        else {
            ctx.fillStyle = this.color;
            fillCircle(
                x,
                y,
                this.m-10,
                ctx 
            );
            ctx.strokeStyle = this.borderColor;
            ctx.lineWidth = 10;
            strokeCircle(
                x,
                y,
                this.m-10,
                ctx 
            );
        }

        if(displayParams['showRanges']) {
            ctx.lineWidth = 2;
            if(this.strongNuclearCharge != 0) {
                ctx.strokeStyle = '#ff6969';
                strokeCircle(
                    x,
                    y,
                    this.strongNuclearRange,
                    ctx 
                );
            }

            if(this.electromagneticCharge != 0) {
                ctx.strokeStyle = '#a1a1ff';
                strokeCircle(
                    x,
                    y,
                    physicsParams['electromagneticRange'],
                    ctx 
                );
            }
        }
    }

    // Accumulates this particle's electromagnetic force on a probe of the given
    // charge at (x, y) into `out`. Takes raw coordinates rather than a Particle so
    // the field visualization can sample it without allocating a dummy particle.
    addElectromagneticForceAt(out: Vector2, x: number, y: number, charge: number, physicsParams: Record<string, any>) {
        const dx = x - this.pos.x;
        const dy = y - this.pos.y;
        const distance = Math.sqrt(dx*dx + dy*dy) - this.m;
        const range = physicsParams['electromagneticRange'];
        if(distance >= range) return; // smoothstep would mask this to zero

        const chargeInteraction = computeChargeInteraction(this.electromagneticCharge, charge);
        if(chargeInteraction == 0) return;

        const scale = smoothstep(range, 0, distance) * chargeInteraction * physicsParams['electromagneticStrength'];
        out.x += dx * scale;
        out.y += dy * scale;
    }

    getElectromagneticForce(particle: Particle, physicsParams: Record<string, any>) {
        const force = new Vector2();
        if(particle !== this)
            this.addElectromagneticForceAt(force, particle.pos.x, particle.pos.y, particle.electromagneticCharge, physicsParams);
        return force;
    }

    getStrongNuclearForce(particle: Particle) {
        const force = new Vector2();
        if(particle !== this) {
            const dir = VECTOR2.sub(particle.pos, this.pos);
            const distance = dir.mag() - this.m;
            const distanceMask = smoothstep(this.strongNuclearRange, 0, distance);
            const chargeInteraction = this.strongNuclearCharge * particle.strongNuclearCharge;
            dir.mult(distanceMask * chargeInteraction * strongNuclearStrength);
            force.add(dir);
        }
        return force;
    }

    getExclusionForce(particle: Particle) {
        const force = new Vector2();
        if(particle !== this) {
            const dir = VECTOR2.sub(particle.pos, this.pos);
            const distance = dir.mag() - this.m;
            const distanceMask = smoothstep(this.m, 0, distance);
            dir.mult(distanceMask * exclusionStrength * particle.m);
            force.sub(dir);
        }
        return force;
    }

    update(particles: Particle[], physicsParams: Record<string, any>) {
        const totalEMF = new Vector2();
        const totalSNF= new Vector2();
        const totalExclusionForce = new Vector2();
        for(const particle of particles) {
            const EMF = this.getElectromagneticForce(particle, physicsParams);
            totalEMF.add(EMF);

            const SNF = this.getStrongNuclearForce(particle);
            totalSNF.add(SNF);

            const exclusionForce = this.getExclusionForce(particle);
            totalExclusionForce.add(exclusionForce);
        }
        this.acc.add(totalEMF);
        this.acc.add(totalSNF);
        this.acc.add(totalExclusionForce);

        const dragForce = VECTOR2.mult(this.vel, dragRate);
        this.acc.sub(dragForce);

        this.acc.limit(maxAcc);

        this.vel.add(this.acc);
        this.pos.add(this.vel);

        this.acc = new Vector2();
    }
}
export default Particle;
