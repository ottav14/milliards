export const batchCircle = (x: number, y: number, r: number, ctx: CanvasRenderingContext2D) => {
    ctx.moveTo(x, y);
    ctx.arc(x, y, r, 0, 2*Math.PI);
}

export const fillCircle = (x: number, y: number, r: number, ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2*Math.PI);
    ctx.fill();
}

export const strokeCircle = (x: number, y: number, r: number, ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2*Math.PI);
    ctx.stroke();
}
