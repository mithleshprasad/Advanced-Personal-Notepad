const canvas = document.getElementById("whiteboard");
const ctx = canvas.getContext("2d");

let isDrawing = false;
let startX = 0;
let startY = 0;
let currentTool = "brush"; // Default tool
let history = [];
let redoStack = [];

// Initialize canvas background
canvas.width = 800;
canvas.height = 600;
ctx.fillStyle = "#ffffff";
ctx.fillRect(0, 0, canvas.width, canvas.height);
saveHistory();

// Event Listeners
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);

// Tool Selection
document.getElementById("toolPicker").addEventListener("change", (e) => {
  currentTool = e.target.value;
});

// Color Picker
document.getElementById("colorPicker").addEventListener("input", (e) => {
  ctx.strokeStyle = e.target.value;
});

// Brush Size
document.getElementById("sizePicker").addEventListener("input", (e) => {
  ctx.lineWidth = e.target.value;
});

// Background Color
document.getElementById("bgColorPicker").addEventListener("input", (e) => {
  ctx.fillStyle = e.target.value;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  restoreFromHistory();
});

// Drawing Functions
function startDrawing(e) {
  isDrawing = true;
  startX = e.offsetX;
  startY = e.offsetY;

  if (currentTool === "text") {
    const text = prompt("Enter text:");
    if (text) {
      ctx.font = `${ctx.lineWidth * 2}px Arial`;
      ctx.fillStyle = ctx.strokeStyle;
      ctx.fillText(text, startX, startY);
      saveHistory();
    }
    isDrawing = false;
  }
}

function draw(e) {
  if (!isDrawing) return;

  switch (currentTool) {
    case "brush":
      ctx.lineCap = "round";
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
      break;

    case "eraser":
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
      ctx.globalCompositeOperation = "source-over";
      break;

    case "line":
      restoreFromHistory();
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      break;

    case "rectangle":
      restoreFromHistory();
      ctx.beginPath();
      ctx.rect(startX, startY, e.offsetX - startX, e.offsetY - startY);
      ctx.stroke();
      break;

    case "circle":
      restoreFromHistory();
      const radius = Math.sqrt(
        Math.pow(e.offsetX - startX, 2) + Math.pow(e.offsetY - startY, 2)
      );
      ctx.beginPath();
      ctx.arc(startX, startY, radius, 0, Math.PI * 2);
      ctx.stroke();
      break;

    case "freehand":
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      break;
  }
}

function stopDrawing() {
  if (!isDrawing) return;
  isDrawing = false;
  ctx.beginPath(); // Reset path for next stroke
  saveHistory();
}

// Undo/Redo Functions
document.getElementById("undoButton").addEventListener("click", undo);
document.getElementById("redoButton").addEventListener("click", redo);

function undo() {
  if (history.length > 1) {
    redoStack.push(history.pop());
    restoreFromHistory();
  }
}

function redo() {
  if (redoStack.length > 0) {
    history.push(redoStack.pop());
    restoreFromHistory();
  }
}

function restoreFromHistory() {
  const img = new Image();
  const lastState = history[history.length - 1];
  img.src = lastState;
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  };
}

function saveHistory() {
  if (history.length > 10) history.shift(); // Limit history to 10 states
  history.push(canvas.toDataURL());
  redoStack = []; // Clear redo stack after new action
}

// Clear Canvas
document.getElementById("clearButton").addEventListener("click", () => {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  saveHistory();
});

// Save Drawing
document.getElementById("saveButton").addEventListener("click", () => {
  const dataURL = canvas.toDataURL();
  const a = document.createElement("a");
  a.href = dataURL;
  a.download = "drawing.png";
  a.click();
});

// Load Previous Drawing
document.getElementById("loadButton").addEventListener("click", () => {
  const savedDrawings = JSON.parse(localStorage.getItem("drawings")) || [];
  if (savedDrawings.length === 0) {
    alert("No saved drawings found!");
    return;
  }
  const img = new Image();
  img.src = savedDrawings.pop();
  img.onload = () => ctx.drawImage(img, 0, 0);
  localStorage.setItem("drawings", JSON.stringify(savedDrawings));
});

// Download Drawing
document.getElementById("downloadButton").addEventListener("click", () => {
  const dataURL = canvas.toDataURL();
  const a = document.createElement("a");
  a.href = dataURL;
  a.download = "drawing.png";
  a.click();
});
