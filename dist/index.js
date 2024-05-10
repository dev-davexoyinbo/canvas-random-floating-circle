"use strict";
var store = {
    circles: [],
    CIRCLE_DENSITY: 0.00015,
    mousePosition: {
        x: undefined,
        y: undefined,
    },
};
var DEVICE_DPI_RATIO = window.devicePixelRatio || 1;
var Circle = (function () {
    function Circle(context, x, y, r, dx, dy, color) {
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
    Circle.prototype.draw = function () {
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        this.context.lineWidth = 1;
        this.context.strokeStyle = this.color;
        this.context.stroke();
        this.context.fillStyle = this.shouldFill ? this.color : "transparent";
        this.context.fill();
    };
    Circle.prototype.update = function () {
        Object.assign(this, {
            x: this.x + this.dx,
            y: this.y + this.dy,
        });
        if (this.x + this.r >= getCanvasWidth(canvas)) {
            this.dx = Math.abs(this.dx) * -1;
        }
        else if (this.x - this.r <= 0) {
            this.dx = Math.abs(this.dx);
        }
        if (this.y + this.r >= getCanvasHeight(canvas)) {
            this.dy = Math.abs(this.dy) * -1;
        }
        else if (this.y - this.r <= 0) {
            this.dy = Math.abs(this.dy);
        }
        var distanceToMouse = store.mousePosition.x === undefined || store.mousePosition.y === undefined
            ? Infinity
            : Math.hypot(this.x - store.mousePosition.x, this.y - store.mousePosition.y);
        if (distanceToMouse < 100 && this.r < 200) {
            this.r += 1;
            this.shouldFill = true;
        }
        else if (this.r > this.originalRadius) {
            this.r -= 1;
            this.shouldFill = false;
        }
        else {
            this.shouldFill = false;
        }
        this.draw();
    };
    return Circle;
}());
var canvas = document.querySelector(".canvas");
var context = canvas.getContext("2d");
window.addEventListener("resize", function () { return setCanvasToFullScreen(canvas); });
setCanvasToFullScreen(canvas);
function setCanvasSize(canvas, width, height) {
    var context = canvas.getContext("2d");
    canvas.width = width * DEVICE_DPI_RATIO;
    canvas.height = height * DEVICE_DPI_RATIO;
    context === null || context === void 0 ? void 0 : context.scale(DEVICE_DPI_RATIO, DEVICE_DPI_RATIO);
    canvas.style.width = "".concat(width, "px");
    canvas.style.height = "".concat(height, "px");
}
function getCanvasWidth(canvas) {
    return canvas.getBoundingClientRect().width;
}
function getCanvasHeight(canvas) {
    return canvas.getBoundingClientRect().height;
}
function setCanvasToFullScreen(canvas) {
    setCanvasSize(canvas, window.innerWidth, window.innerHeight);
    initialize();
}
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
function getRandomColor() {
    return "rgba(".concat(Math.floor(Math.random() * 256), ", ").concat(Math.floor(Math.random() * 256), ", ").concat(Math.floor(Math.random() * 256), ", ").concat(0.5 + Math.random() * 0.5, ")");
}
function initialize() {
    var area = getCanvasWidth(canvas) * getCanvasHeight(canvas);
    var count = Math.floor(area * store.CIRCLE_DENSITY);
    if (count > store.circles.length) {
        for (var i = 0; i < count - store.circles.length; i++) {
            var r = getRandomNumber(10, 30);
            var color = getRandomColor();
            var x = getRandomNumber(r, getCanvasWidth(canvas) - r);
            var y = getRandomNumber(r, getCanvasHeight(canvas) - r);
            var dx = getRandomNumber(-2, 2) || (Math.random() < 0.5 ? getRandomNumber(-0.1, -4) : getRandomNumber(0.1, 4));
            var dy = getRandomNumber(-2, 2) || (Math.random() < 0.5 ? getRandomNumber(-0.1, -4) : getRandomNumber(0.1, 4));
            var circle = new Circle(context, x, y, r, dx * 0.5, dy * 0.5, color);
            store.circles.push(circle);
            circle.draw();
        }
    }
    else {
        store.circles = store.circles.slice(0, count);
    }
}
function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < store.circles.length; i++) {
        store.circles[i].update();
    }
    requestAnimationFrame(animate);
}
canvas.addEventListener("mousemove", function (event) {
    Object.assign(store.mousePosition, {
        x: event.clientX,
        y: event.clientY,
    });
});
canvas.addEventListener("mouseleave", function (event) {
    Object.assign(store.mousePosition, {
        x: undefined,
        y: undefined,
    });
    console.log("mouse leave");
});
initialize();
animate();
