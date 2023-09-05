const canvas = document.getElementById('canvas');
const slider = document.getElementById('slider');
const displayGridSize = document.getElementById('display-grid-size');
const colorPicker = document.getElementById('colorPicker');

const brushBtn = document.getElementById('brushBtn');
const eraserBtn = document.getElementById('eraserBtn');
const rainbowBtn = document.getElementById('rainbowBtn');
const shadeBtn = document.getElementById('shadeBtn');
const lightenBtn = document.getElementById('lightenBtn');
const clearBtn = document.getElementById('clearBtn');

const DEFAULT_COLOR = '#000000';
const DEFAULT_MODE = 'brush';
const DEFAULT_SIZE = 16;

let currentColor = DEFAULT_COLOR;
let currentMode = DEFAULT_MODE;
let currentGridSize = DEFAULT_SIZE;
let mouseDown = false;

// <--------------------------------------------------------------------------------------------------------------------->
// <--------------------------------------------------------------------------------------------------------------------->
// <--------------------------------------------------------------------------------------------------------------------->

function setColor(newColor) {
    currentColor = newColor;
}

function setGridSize(newSize) {
    currentGridSize = newSize;
    clearGrid();
    loadGrid();
}

function setActiveBtn(newMode) {
    if (currentMode === 'brush') brushBtn.classList.remove('active');
    else if (currentMode === 'eraser')  eraserBtn.classList.remove('active');
    else if (currentMode === 'rainbow') rainbowBtn.classList.remove('active');
    else if (currentMode === 'shade') shadeBtn.classList.remove('active');
    else if (currentMode === 'lighten') lightenBtn.classList.remove('active');
    
    if (newMode === 'brush') brushBtn.classList.add('active');
    else if (newMode === 'eraser')  eraserBtn.classList.add('active');
    else if (newMode === 'rainbow') rainbowBtn.classList.add('active');
    else if (newMode === 'shade') shadeBtn.classList.add('active');
    else if (newMode === 'lighten') lightenBtn.classList.add('active');

    currentMode = newMode;
}

function getPixelSize() {
    return canvas.getBoundingClientRect().width / currentGridSize;  // Calculate average size of each pixel in the canvas: (width of canvas) / (length of grid)
}

function changeColor(event) {
    if (currentMode === 'brush') {
        event.target.style.backgroundColor = currentColor;
    }
    else if (currentMode === 'rainbow') {
        const randRed = Math.floor(Math.random() * 256);
        const randGreen = Math.floor(Math.random() * 256);
        const randBlue = Math.floor(Math.random() * 256);
        event.target.style.backgroundColor = `rgb(${randRed}, ${randGreen}, ${randBlue})`
    }
    else if (currentMode === 'eraser') {
        event.target.style.backgroundColor = 'white';
    }
    else {
        const hexColor = getHex(event.target.style.backgroundColor);
        console.log(hexColor);
        let newShade = '';

        if (currentMode === 'shade') newShade = getNewShade(hexColor, -10);
        else if (currentMode === 'lighten') newShade = getNewShade(hexColor, 10);

        console.log('shade changed');
            
        event.target.style.backgroundColor = newShade;
    }
}

function getHex(rgb) {
    let rgbList = rgb.replace(/[^\d,]/g, '').split(',');   
    return componentToHex(parseInt(rgbList[0])) + componentToHex(parseInt(rgbList[1])) + componentToHex(parseInt(rgbList[2]))   ;
}

function componentToHex(component) {
    const hex = component.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function getNewShade(hexColor, magnitude) {
    hexColor = hexColor.replace(`#`, ``);
    if (hexColor.length === 6) {
        const decimalColor = parseInt(hexColor, 16);
        let red = (decimalColor >> 16) + magnitude;
        red > 255 && (red = 255);
        red < 0 && (red = 0);
        let green = (decimalColor & 0x0000ff) + magnitude;
        green > 255 && (green = 255);
        green < 0 && (green = 0);
        let blue = ((decimalColor >> 8) & 0x00ff) + magnitude;
        blue > 255 && (blue = 255);
        blue < 0 && (blue = 0);
        console.log(`#${(green | (blue << 8) | (red << 16)).toString(16)}`)
        return `#${(green | (blue << 8) | (red << 16)).toString(16)}`;
    }
    
    console.log(hexColor);
    return hexColor;
}

function loadGrid() {
    let sizeOfPixel = getPixelSize();

    for (let i = 0; i < currentGridSize * currentGridSize; i++) {
        const pixelElement = document.createElement('div');
        pixelElement.setAttribute('id', 'pixel');
        pixelElement.style.width = sizeOfPixel;
        pixelElement.style.height = sizeOfPixel;
        pixelElement.style.backgroundColor = 'rgb(255, 255, 255)';
        pixelElement.addEventListener('mousedown', () => mouseDown = true);
        pixelElement.addEventListener('mouseup', () => mouseDown = false);
        pixelElement.addEventListener('mousemove', (event) => {
            if (mouseDown)
                changeColor(event);
        });
        canvas.appendChild(pixelElement);
    }
    
    displayGridSize.textContent = "Grid Size: " + slider.value + " x " + slider.value;     
}

function clearGrid() {
    canvas.innerHTML = '';
}

function reloadGrid() {
    clearGrid();
    loadGrid();
}

colorPicker.addEventListener('input', (event) => setColor(event.target.value));
slider.addEventListener('input', (event) => setGridSize(event.target.value));
brushBtn.addEventListener('click', () => setActiveBtn('brush'));
eraserBtn.addEventListener('click', () => setActiveBtn('eraser'));
rainbowBtn.addEventListener('click', () => setActiveBtn('rainbow'));
shadeBtn.addEventListener('click', () => setActiveBtn('shade'));
lightenBtn.addEventListener('click', () => setActiveBtn('lighten'));
clearBtn.addEventListener('click', () => reloadGrid());

// <--------------------------------------------------------------------------------------------------------------------->
// <--------------------------------------------------------------------------------------------------------------------->
// <--------------------------------------------------------------------------------------------------------------------->

loadGrid();
setActiveBtn(currentMode);