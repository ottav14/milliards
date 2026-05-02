import Particle from './Particle.ts';

class Blue extends Particle {
    constructor(x: number, y: number) {
        super(x, y);
        this.m = 30;
        this.color = '#a1a1ff';
        this.borderColor = '#7d7dff';
        this.electromagneticCharge = -1;
    }
}
export default Blue;
