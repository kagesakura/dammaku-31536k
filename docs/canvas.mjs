const canvas = document.getElementById("canvas");
export const context = canvas.getContext("2d");
export const clearCanvas = () => {
  context.fillStyle = "#352a2a";
  context.fillRect(0, 0, canvas.width, canvas.height);
};
export const canvasHeight = (canvas.height = 1918);
export const canvasWidth = (canvas.width = 1644);

canvas.addEventListener("contextmenu", e => e.preventDefault());

await new Promise(resolve => window.addEventListener("load", resolve, { once: true }));

const { clientWidth, clientHeight, style: htmlStyle } = document.documentElement;
if (clientWidth * 7 < clientHeight * 6) {
  canvas.style.width = clientWidth - 4 + "px";
} else {
  canvas.style.height = clientHeight - 3 + "px";
}
// htmlStyle.height = clientHeight + "px";
htmlStyle.width = clientWidth + "px";

await new Promise(resolve => setTimeout(resolve, 1));

const boundRect = canvas.getBoundingClientRect();

export const canvasTop = boundRect.top;
export const canvasLeft = boundRect.left;
export const canvasRealHeight = boundRect.height;
export const canvasRealWidth = boundRect.width;
