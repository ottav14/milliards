import Particle from './Particle.ts';

class Red extends Particle {
    constructor(x: number, y: number) {
        super(x, y);
        this.color = '#ff6969';
        this.borderColor = '#ff4d4d';
        this.electromagneticCharge = 1;
        this.strongNuclearCharge = 1;
    }
}
export default Red;
