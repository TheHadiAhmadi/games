export function color2str(color) {
  return `rgb(${color[0]},${color[1]},${color[2]})`;
}

function randomValue() {
  return Math.floor(Math.random() * 256);
}

export function getRandomColor() {
  return [randomValue(), randomValue(), randomValue()];
}
