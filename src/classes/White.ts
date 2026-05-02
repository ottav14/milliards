import Particle from './Particle.ts';

class White extends Particle {
    constructor(x: number, y: number) {
        super(x, y);
        this.color = '#8a8a8a';
        this.borderColor = '#6e6e6e';
        this.strongNuclearCharge = 1;
    }
}
export default White;
