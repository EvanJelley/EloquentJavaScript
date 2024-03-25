class Picture {
    constructor(width, height, pixels) {
        this.width = width;
        this.height = height;
        this.pixels = pixels;
    }

    static empty(width, height, color) {
        let pixels = new Array(width * height).fill(color);
        return new Picture(width, height, pixels);
    }

    pixel(x, y) {
        return this.pixels[x + y * this.width];
    }

    draw(pixels) {
        let copy = this.pixels.slice();
        for (let {x, y, color} of pixels) {
            copy[x + y * this.width] = color;
        }
        return new Picture(this.width, this.height, copy);
    }
};

function elt(type, props, ...children) {
    let dom = document.createElement(type);
    if (props) Object.assign(dom, props);
    for (let child of children) {
        if (typeof child != "string") dom.appendChild(child);
        else dom.appendChild(document.createTextNode(child));
    }
    return dom;
};

const scale = 10;

class PictureCanvas {
    constructor(picture, pointerDown) {
        this.dom = elt("canvas", {
            onmousedown: event => this.mouse(event, pointerDown),
            ontouchstart: event => this.touch(event, pointerDown)
        });
        this.syncState(picture);
    }

    syncState(picture) {
        if (this.picture == picture) return;
        this.picture = picture;
        drawPicture(this.picture, this.dom, scale);
    }

    mouse(downEvent, onDown) {
        if (downEvent.button != 0) return;
        let pos = pointerPosition(downEvent, this.dom);
        let onMove = onDown(pos);
        if (!onMove) return;
        let move = moveEvent => {
            if (moveEvent.buttons == 0) {
                this.dom.removeEventListener("mousemove", move);
            } else {
                let newPos = pointerPosition(moveEvent, this.dom);
                if (newPos.x == pos.x && newPos.y == pos.y) return;
                pos = newPos;
                onMove(newPos);
            }
        };
        this.dom.addEventListener("mousemove", move);
    }

    touch(startEvent, onDown) {
        let pos = pointerPosition(startEvent.touches[0], this.dom);
        startEvent.preventDefault();
        let onMove = onDown(pos);
        let move = moveEvent => {
            let newPos = pointerPosition(moveEvent.touches[0], this.dom);
            if (newPos.x == pos.x && newPos.y == pos.y) return;
            pos = newPos;
            onMove(newPos);
        };
        let end = () => {
            this.dom.removeEventListener("touchmove", move);
            this.dom.removeEventListener("touchend", end);
        };
        this.dom.addEventListener("touchmove", move);
        this.dom.addEventListener("touchend", end);
    }
};

function pointerPosition(pos, domNode) {
    let rect = domNode.getBoundingClientRect();
    return {x: Math.floor((pos.clientX - rect.left) / scale),
            y: Math.floor((pos.clientY - rect.top) / scale)};
};

class PixelEditor {
    constructor(state, config) {
        let {tools, controls, dispatch} = config;
        this.state = state;

        this.canvas = new PictureCanvas(state.picture, pos => {
            let tool = tools[this.state.tool];
            let onMove = tool(pos, this.state, dispatch);
            if (onMove) return pos => onMove(pos, this.state);
        });

        this.controls = controls.map(
            Control => new Control(state, config, dispatch));
        this.dom = elt("div", {}, this.canvas.dom, elt("br"),
                       ...this.controls.reduce(
                           (a, c) => a.concat(" ", c.dom), []));
    }
    syncState(state) {
        this.state = state;
        this.canvas.syncState(state.picture);
        for (let ctrl of this.controls) ctrl.syncState(state);
    }
}

class ToolSelect {
    constructor(state, {tools, dispatch}) {
        this.select = elt("select", {
            onchange: () => dispatch({tool: this.select.value})
        }, ...Object.keys(tools).map(name => elt("option", {
            selected: name == state.tool
        }, name)));
        this.dom = elt("label", null, "🖌 Tool: ", this.select);
    }
    syncState(state) { this.select.value = state.tool; }
}

class ColorSelect {
    constructor(state, {dispatch}) {
        this.input = elt("input", {
            type: "color",
            value: state.color,
            onchange: () => dispatch({color: this.input.value})
        });
        this.dom = elt("label", null, "🎨 Color: ", this.input);
    }
    syncState(state) { this.input.value = state.color; }
}