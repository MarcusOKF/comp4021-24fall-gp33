const Marble = (ctx, x, y, color) => {

    let speed = 0;
    let points = 10;
    
    const draw = () => {
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
    }

    return { draw }
}