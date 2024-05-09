const store = {
  circles: [] as Circle[],
  CIRCLE_DENSITY: 0.0005,
  mousePosition: {
    x: undefined,
    y: undefined,
  },
};

console.log("This is the index page");

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
  constructor(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    r: number,
    dx: number,
    dy: number,
    color: string
  ) {
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
    this.context.stroke();
    this.context.fillStyle = this.shouldFill ? this.color : "transparent";
    this.context.fill();
  }

  update() {
    Object.assign(this, {
      x: this.x + this.dx,
      y: this.y + this.dy,
    });

    if (this.x + this.r >= this.context.canvas.width) {
      this.dx = Math.abs(this.dx) * -1;
    } else if (this.x - this.r <= 0) {
      this.dx = Math.abs(this.dx);
    }
    if (this.y + this.r >= this.context.canvas.height) {
      this.dy = Math.abs(this.dy) * -1;
    } else if (this.y - this.r <= 0) {
      this.dy = Math.abs(this.dy);
    }

    const distanceToMouse =
      store.mousePosition.x === undefined || store.mousePosition.y === undefined
        ? Infinity
        : Math.hypot(
            this.x - store.mousePosition.x,
            this.y - store.mousePosition.y
          );
    if (distanceToMouse < 100 && this.r < 200) {
      this.r += 1;
      this.shouldFill = true;
    } else if (this.r > this.originalRadius) {
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
const canvas: HTMLCanvasElement = document.querySelector(
  ".canvas"
) as HTMLCanvasElement;
/**
 * 2D rendering context for the canvas
 * @type {CanvasRenderingContext2D}
 */
const context: CanvasRenderingContext2D = canvas.getContext(
  "2d"
) as CanvasRenderingContext2D;

window.addEventListener("resize", () => setCanvasToFullScreen(canvas));
setCanvasToFullScreen(canvas);

/**
 * Sets the size of the canvas element.
 *
 * @param {HTMLCanvasElement} canvas - The canvas element to set the size for.
 * @param {number} width - The desired width of the canvas.
 * @param {number} height - The desired height of the canvas.
 */
function setCanvasSize(
  canvas: HTMLCanvasElement,
  width: number,
  height: number
) {
  canvas.width = width;
  canvas.height = height;
}

/**
 *
 * @param {HTMLCanvasElement} canvas
 */
function setCanvasToFullScreen(canvas: HTMLCanvasElement) {
  setCanvasSize(canvas, window.innerWidth, window.innerHeight);
  initialize();
}

function initialize() {
  const area = canvas.width * canvas.height;
  const count = Math.floor(area * store.CIRCLE_DENSITY);

  // store.circles = [];
  if (count > store.circles.length) {
    for (let i = 0; i < count - store.circles.length; i++) {
      const r = 10 + Math.floor(Math.random() * 30);
      const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)}, ${0.5 + Math.random() * 0.5})`;
      const x = Math.random() * (canvas.width - r * 2) + r;
      const y = Math.random() * (canvas.height - r * 2) + r;
      const dx = 1 + (Math.random() - 0.5) * 3;
      const dy = 1 + (Math.random() - 0.5) * 3;
      const circle = new Circle(context, x, y, r, dx, dy, color);
      store.circles.push(circle);
      circle.draw();
    }
  } else {
    store.circles = store.circles.slice(0, count);
  }
}

function animate() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < store.circles.length; i++) {
    store.circles[i].update();
  }
  requestAnimationFrame(animate);
}

canvas.addEventListener("mousemove", (event) => {
  Object.assign(store.mousePosition, {
    x: event.clientX,
    y: event.clientY,
  });
});
canvas.addEventListener("mouseleave", (event) => {
  Object.assign(store.mousePosition, {
    x: undefined,
    y: undefined,
  });

  console.log("mouse leave");
});

initialize();
animate();
