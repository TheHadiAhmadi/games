export function drag(node, handler) {
  let x = 0;
  let y = 0;
  let down = false;

  // helper functions -------------------------------
  function cancel() {
    down = false;
  }

  function respond(newX, newY) {
    const delta = [newX - x, newY - y];
    const distance = Math.sqrt(Math.pow(delta[0], 2) + Math.pow(delta[1], 2));
    const direction = [delta[0] / distance, delta[1] / distance];
    const startPos = [x, y];

    handler({ down, delta, startPos, distance, direction, cancel });
  }

  // ---- mouse events -------------------------------
  function onMouseDown(e) {
    down = true;
    x = e.clientX;
    y = e.clientY;
  }

  function onMouseUp(e) {
    if (down) {
      down = false;
      respond(e.clientX, e.clientY);
    }
  }

  function onMouseMove(e) {
    if (down) respond(e.clientX, e.clientY);
  }

  node.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);

  // touch events -----------------------------------

  let lastX;
  let lastY;

  function onTouchStart(e) {
    down = true;
    x = e.targetTouches[0].clientX;
    y = e.targetTouches[0].clientY;
  }

  function onTouchMove(e) {
    lastX = e.targetTouches[0].clientX;
    lastY = e.targetTouches[0].clientY;
    if (down) respond(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
  }

  // TODO: the respond argument values must not be (x, y)
  function onTouchEnd(e) {
    if (down) {
      down = false;
      respond(lastX, lastY);
    }
  }

  node.addEventListener("touchstart", onTouchStart);
  window.addEventListener("touchmove", onTouchMove);
  window.addEventListener("touchend", onTouchEnd);

  return {
    destroy: () => {
      // remove mouse events
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
      node.removeEventListener("mousedown", onMouseDown);

      // remove touch events
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchmove", onTouchMove);
      node.removeEventListener("touchstart", onTouchStart);
    },
  };
}
