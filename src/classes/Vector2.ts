export const add = (a: Vector2, b: Vector2) => {
    return new Vector2(
        a.x + b.x,
        a.y + b.y 
    );
}

export const sub = (a: Vector2, b: Vector2) => {
    return new Vector2(
        a.x - b.x,
        a.y - b.y 
    );
}

export const mult = (v: Vector2, a: number) => {
    return new Vector2(
        v.x * a,
        v.y * a
    );
}

class Vector2 {
    x: number;
    y: number;
    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    add(other: Vector2) {
        this.x += other.x;
        this.y += other.y;
    }

    sub(other: Vector2) {
        this.x -= other.x;
        this.y -= other.y;
    }

    mult(scalar: number) {
        this.x *= scalar;
        this.y *= scalar;
    }

    mag() {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }

    limit(val: number) {
        const mag = this.mag();
        if(mag == 0) return;
        if(mag > val) {
            this.x *= val / mag;
            this.y *= val / mag;
        }
    }
}
export default Vector2;
