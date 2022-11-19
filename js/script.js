// Global variabeles
const canvas = document.querySelector("canvas"),
  toolBtns = document.querySelectorAll(".tool"),
  fillColor = document.querySelector("#fill-color"),
  sizeSlider = document.querySelector("#size-slider"),
  colorBtns = document.querySelectorAll(".colors .option"),
  colorPicker = document.querySelector("#color-picker"),
  clearCanvasBtn = document.querySelector(".clear-canvas"),
  saveImageBtn = document.querySelector(".save-img");

// Veriables with default value
let ctx = canvas.getContext("2d"),
  isDrawing = false,
  brushWidth = 5,
  selectedTool = "brush",
  selectedColor = "#000",
  prewMouseX,
  prewMouseY,
  snapeshot;

// Set canvas background
const setCanvasBackground = () => {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor;
};

// Set conves width and height
window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();
});

// Start drawing
const startDraw = (event) => {
  isDrawing = true;
  prewMouseX = event.offsetX;
  prewMouseY = event.offsetY;
  ctx.beginPath();
  ctx.lineWidth = brushWidth;
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;
  snapeshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

// Draw regtangle
const drawRectangle = (event) => {
  fillColor.checked
    ? ctx.fillRect(
        event.offsetX,
        event.offsetY,
        prewMouseX - event.offsetX,
        prewMouseY - event.offsetY
      )
    : ctx.strokeRect(
        event.offsetX,
        event.offsetY,
        prewMouseX - event.offsetX,
        prewMouseY - event.offsetY
      );
};

// Draw circle
const drawCircle = (event) => {
  ctx.beginPath();
  const radius = Math.sqrt(
    Math.pow(prewMouseX - event.offsetX, 2) +
      Math.pow(prewMouseY - event.offsetY, 2)
  );
  ctx.arc(prewMouseX, prewMouseY, radius, 0, 2 * Math.PI);
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

// Draw triangle
const drawTriangle = (event) => {
  ctx.beginPath();
  ctx.moveTo(prewMouseX, prewMouseY);
  ctx.lineTo(event.offsetX, event.offsetY);
  ctx.lineTo(prewMouseX * 2 - event.offsetX, event.offsetY);
  ctx.closePath();
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

// Drawing
const driving = (event) => {
  if (!isDrawing) return;
  ctx.putImageData(snapeshot, 0, 0);

  switch (selectedTool) {
    case "brush":
      ctx.lineTo(event.offsetX, event.offsetY);
      ctx.stroke();
      break;

    case "rectangle":
      drawRectangle(event);
      break;

    case "circle":
      drawCircle(event);
      break;

    case "triangle":
      drawTriangle(event);
      break;

    case "eraser":
      ctx.strokeStyle = "#fff";
      ctx.lineTo(event.offsetX, event.offsetY);
      ctx.stroke();
      break;

    default:
      break;
  }
};

// Tools btn and set to veriables selected tool
toolBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
  });
});

// Change brush width
sizeSlider, addEventListener("change", () => (brushWidth = sizeSlider.value));

// Set color to shapes
colorBtns.forEach((btn) => {
  btn.addEventListener("click", (evnt) => {
    document.querySelector(".options .selected").classList.remove("selected");
    btn.classList.add("selected");
    const bgColor = window
      .getComputedStyle(btn)
      .getPropertyValue("background-color");
    selectedColor = bgColor;
  });
});

// Set color from color picker
colorPicker.addEventListener("change", () => {
  colorPicker.parentElement.style.background = colorPicker.value;
  colorPicker.parentElement.click();
});

// Clear canvas button
clearCanvasBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setCanvasBackground();
});

// Save like image our paint
saveImageBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `Project-paint${Date.now()}.jpg`;
  link.href = canvas.toDataURL();
  link.click();
});

// Stop drawing
const stopDraw = () => {
  isDrawing = false;
};

canvas.addEventListener("mousemove", driving);
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", stopDraw);
