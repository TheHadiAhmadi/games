declare global {
	interface WindowEventMap {}
}

export type DragSettings = {
	axis: 'x' | 'y' | 'both';
	throttle?: number,
	handleStart?: any,
	handleMove?: any,
	handleEnd?: any
};

export type DragCoord = [x: number, y: number];
export type DragOptions = {
	/**
	 * TODO
	 */
	delta: DragCoord;

	/**
	 * start position of mouse or touch
	 */
	start: DragCoord;

	/**
	 * distance between start position and current position
	 */
	distance: number;

	/**
	 * cancel the drag
	 */
	cancel: () => void;
};

export type DragHandler = ({ detail: DragOptions }) => void;

export default function drag(node: HTMLElement, settings: DragSettings ={axis: "both", throttle: 10}) {
	let x = 0;
	let y = 0;
	let down = false;
	settings.throttle = settings.throttle ?? 10 
	settings.axis = settings.axis ?? 'both' 

	function cancel() {
		down = false;
	}

	function startDrag() {
		node.dispatchEvent(new CustomEvent<DragCoord>('dragstart', { detail: [x, y] }));
	}

	function respond(newPos: DragCoord) {
		const delta: DragCoord = [newPos[0] - x, newPos[1] - y];
		const distance = Math.sqrt(Math.pow(delta[0], 2) + Math.pow(delta[1], 2));
		const start: DragCoord = [x, y];

		const options: any = { cancel };
		if (settings.axis === 'both') {
			options.delta = delta;
			options.distance = distance;
			options.start = start;
		} else if (settings.axis === 'x') {

			if(Math.abs(delta[0]) < settings.throttle && Math.abs(delta[1]) > settings.throttle) {
				cancel()
			}
			

			options.distance = delta[0];
			options.start = start[0];
		} else if (settings.axis === 'y') {

			if(Math.abs(delta[1]) < settings.throttle && Math.abs(delta[0]) > settings.throttle) {
				cancel()
			}
			
			options.distance = delta[1];
			options.start = start[1];
		}

		if (down) {
			settings.handleMove?.({detail: options})
			node.dispatchEvent(new CustomEvent<DragOptions>('drag', { detail: options }));
		} else {
			settings.handleEnd?.({detail: options})
			node.dispatchEvent(new CustomEvent<DragOptions>('dragend', { detail: options }));
		}
	}

	// ---- mouse events -------------------------------
	function onMouseDown(e) {
		down = true;
		x = e.clientX;
		y = e.clientY;
		startDrag();
	}

	function onMouseUp(e) {
		if (down) {
			down = false;
			respond([e.clientX, e.clientY]);
		}
	}

	function onMouseMove(e) {
		if (down) respond([e.clientX, e.clientY]);
	}

	node.addEventListener('mousedown', onMouseDown, {passive: true});
	window.addEventListener('mousemove', onMouseMove, {passive: true});
	window.addEventListener('mouseup', onMouseUp);

	// touch events -----------------------------------

	let lastPos: DragCoord = [0, 0];

	function onTouchStart(e) {
		down = true;
		x = e.targetTouches[0].clientX;
		y = e.targetTouches[0].clientY;
		startDrag();
	}

	function onTouchMove(e) {
		lastPos[0] = e.targetTouches[0].clientX;
		lastPos[1] = e.targetTouches[0].clientY;
		if (down) respond(lastPos);
	}

	// TODO: the respond argument values must not be (x, y)
	function onTouchEnd(e) {
		if (down) {
			down = false;
			respond(lastPos);
		}
	}

	node.addEventListener('touchstart', onTouchStart, {passive: true});
	window.addEventListener('touchmove', onTouchMove, {passive: true});
	window.addEventListener('touchend', onTouchEnd);

	return {
		destroy: () => {
			// remove mouse events
			window.removeEventListener('mouseup', onMouseUp);
			window.removeEventListener('mousemove', onMouseMove);
			node.removeEventListener('mousedown', onMouseDown);

			// remove touch events
			window.removeEventListener('touchend', onTouchEnd);
			window.removeEventListener('touchmove', onTouchMove);
			node.removeEventListener('touchstart', onTouchStart);
		}
	};
}
