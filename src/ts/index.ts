
const store = {
    circles: [] as Circle[],
    mousePosition: {
        x: undefined,
        y: undefined
    }
}

console.log("This is the index page")

class Circle {
    x: number;
    y: number;
    r: number;
    dx: number;
    dy: number;
    context: CanvasRenderingContext2D;
    color: string;
    originalRadius: number;
    shouldFill: boolean;
    constructor(context: CanvasRenderingContext2D, x: number, y:number, r: number, dx: number, dy: number, color: string) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.originalRadius = this.r;
        this.dx = dx;
        this.dy = dy;
        this.context = context;
        this.color = color;
        this.shouldFill = false;
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     */
    draw() {
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        this.context.strokeStyle = this.color;
        this.context.stroke()
        this.context.fillStyle = this.shouldFill ? this.color: "transparent";
        this.context.fill()
    }

    update() {
        Object.assign(this, {
            x: this.x + this.dx,
            y: this.y + this.dy
        });

        if ((this.x + this.r) >= this.context.canvas.width) {
            this.dx = Math.abs(this.dx) * -1;
        } else if ((this.x - this.r) <= 0) {
            this.dx = Math.abs(this.dx);
        }
        if ((this.y + this.r) >= this.context.canvas.height) {
            this.dy = Math.abs(this.dy) * -1;
        } else if ((this.y - this.r) <= 0) {
            this.dy = Math.abs(this.dy);
        }

        const distanceToMouse = store.mousePosition.x === undefined || store.mousePosition.y === undefined ? Infinity : Math.hypot(this.x - store.mousePosition.x, this.y - store.mousePosition.y);
        if(distanceToMouse < 100 && this.r < 200) {
            this.r += 1;
            this.shouldFill = true;
        } else if(this.r > this.originalRadius) {
            this.r -= 1;
            this.shouldFill = false;
        } else {
            this.shouldFill = false;
        }

        this.draw();
    }
}

/**
 * Canvas element for drawing
 * @type {HTMLCanvasElement}
 */
const canvas: HTMLCanvasElement = document.querySelector(".canvas") as HTMLCanvasElement;
/**
 * 2D rendering context for the canvas
 * @type {CanvasRenderingContext2D}
 */
const context: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;


window.addEventListener("resize", () => setCanvasToFullScreen(canvas));
setCanvasToFullScreen(canvas);





/**
 * Sets the size of the canvas element.
 *
 * @param {HTMLCanvasElement} canvas - The canvas element to set the size for.
 * @param {number} width - The desired width of the canvas.
 * @param {number} height - The desired height of the canvas.
 */
function setCanvasSize(canvas: HTMLCanvasElement, width: number, height: number) {
    canvas.width = width;
    canvas.height = height;
}

/**
 * 
 * @param {HTMLCanvasElement} canvas 
 */
function setCanvasToFullScreen(canvas: HTMLCanvasElement) {
    setCanvasSize(canvas, window.innerWidth, window.innerHeight);
}

function initialize() {
    for (let i = 0; i < 200; i++) {
        const r = 10 + Math.floor(Math.random() * 30);
        const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${0.5 + Math.random() * 0.5})`;
        const x = Math.random() * (canvas.width - r * 2) + r;
        const y = Math.random() * (canvas.height - r * 2) + r;
        const dx = 1 + (Math.random() - 0.5) * 3;
        const dy = 1 + (Math.random() - 0.5) * 3;
        const circle = new Circle(context, x, y, r, dx, dy, color);
        store.circles.push(circle);
        circle.draw();
    }
}

function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    // context.fillStyle = "red";
    // // rectangle
    // context.fillRect(100, 100, 100, 100)
    // context.fillRect(400, 100, 100, 100)
    // context.fillStyle = "purple";
    // context.fillRect(300, 400, 100, 100)
    // context.fillRect(100, 400, 100, 100)

    // // Line
    // context.beginPath();
    // context.moveTo(50, 300);
    // context.lineTo(300, 100);
    // context.lineTo(400, 300);
    // context.strokeStyle = "green"
    // context.stroke();

    // Arc / Circle

    // for(let i = 0; i < 30; i++) {
    //     const x = Math.random() * (canvas.width - 200) + 100;
    //     const y = Math.random() * (canvas.height - 200) + 100;
    //     const radius = 20 + Math.random() * 80;

    //     const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${0.5 + Math.random() * 0.5})`;

    //     console.log(`x: ${x}, y: ${y}, radius: ${radius}`);

    //     context.beginPath();
    //     context.arc(x, y, radius, 0, Math.PI * 2, false);
    //     context.strokeStyle = color
    //     context.stroke();
    // }
    // context.beginPath();
    // context.arc(store.circle.x, store.circle.y, store.circle.r, 0, Math.PI * 2, false);
    // context.strokeStyle = "red"
    // context.stroke()

    // Object.assign(store.circle, {
    //     x: store.circle.x + store.circle.dx,
    //     y: store.circle.y + store.circle.dy
    // });

    // if ((store.circle.x + store.circle.r) >= canvas.width) {
    //     store.circle.dx = Math.abs(store.circle.dx) * -1;
    // } else if ((store.circle.x - store.circle.r) <= 0) {
    //     store.circle.dx = Math.abs(store.circle.dx);
    // }
    // if ((store.circle.y + store.circle.r) >= canvas.height) {
    //     store.circle.dy = Math.abs(store.circle.dy) * -1;
    // } else if ((store.circle.y - store.circle.r) <= 0) {
    //     store.circle.dy = Math.abs(store.circle.dy);
    // }
    
    for (let i = 0; i < store.circles.length; i++) {
        store.circles[i].update();
    }
    requestAnimationFrame(animate);
}

canvas.addEventListener("mousemove", event => {
    Object.assign(store.mousePosition, {
        x: event.clientX,
        y: event.clientY,
    });
});
canvas.addEventListener("mouseleave", event => {
    Object.assign(store.mousePosition, {
        x: undefined,
        y: undefined,
    });

    console.log("mouse leave")
})


initialize();
animate();




