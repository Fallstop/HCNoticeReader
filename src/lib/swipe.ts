import { setPointerControls } from 'svelte-gestures';
import type { Spring, Tweened } from 'svelte/motion';
import type { Writable } from 'svelte/store';
import { cubicOut, cubicInOut, linear } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';


// Hacked version of 'svelte-gestures' to enable 1:1 gestures and limited to horizontal
// Original: https://github.com/Rezi/svelte-gestures/blob/main/src/swipe.ts
// Is this necessary? No. Are 1:1 gestures satisfying? Absolutely.

export function horizontalSwipe(
	node: HTMLElement,
	parameters: {
		desktopElementBlockList: string[];
		minSwipeDistance: number;
		touchAction: string;
		xMovementStore: Spring<number>
		desktopMode: Writable<boolean>
	}
): { destroy: () => void } {
	const gestureName = 'horizontalSwipe';

	let clientX: number;
	let clientY: number;
	let target: EventTarget | null;
	let validEvent: boolean;
	let _desktop: boolean;

	let deadArea = 10;

	addEventListener('drag',()=>{
		// When the user has highlighted text,
		// then starts dragging, the on:down is triggered
		// but the on:up is not, leaving the on:move firing forever
		validEvent = false;
	});

	parameters.desktopMode.subscribe((value)=>{
		_desktop = value;
	})

	function onDown(activeEvents: PointerEvent[], event: PointerEvent) {
		if (activeEvents.length === 1) {
			target = event.target;
		}

		validEvent = checkValidity();

		clientX = event.clientX;
		clientY = event.clientY;
	}

	function onUp(activeEvents: PointerEvent[], event: PointerEvent) {
		console.log(event.type)
		if (
			(event.type === 'pointerup' || event.type === "pointerleave") &&
			activeEvents.length === 0 &&
			validEvent
		) {
			const x = event.clientX - clientX;
			const y = event.clientY - clientY;
			const absX = Math.abs(x);
			const absY = Math.abs(y);

			let direction: 'top' | 'right' | 'bottom' | 'left' | null = null;
			if (absX >= 2 * absY && absX > parameters.minSwipeDistance) {
				// horizontal (by *2 we eliminate diagonal movements)
				direction = x > 0 ? 'right' : 'left';
			} else if (absY >= 2 * absX && absY > parameters.minSwipeDistance) {
				// vertical (by *2 we eliminate diagonal movements)
				direction = y > 0 ? 'bottom' : 'top';
			}

			if (direction) {
				node.dispatchEvent(
					new CustomEvent(gestureName, {
						detail: { direction, target },
					})
				);
			}
		}
		parameters?.xMovementStore?.set(0);
	}

	const ForceSetSpring = {hard: true}

	function onMove(activeEvents: PointerEvent[], event: PointerEvent) {
		if (!validEvent || Math.abs(event.clientX - clientX) <= deadArea) {
			parameters?.xMovementStore?.set(0, ForceSetSpring);
			return
		}
		let x = event.clientX - clientX;
		x = x>0 ? x-deadArea : x+deadArea;
		parameters?.xMovementStore?.set(x, ForceSetSpring);
	}

	function checkValidity() {
		if (!_desktop) {return true}
		let valid = true;
		for (let blockedElement of parameters.desktopElementBlockList) {
			let targetTag =  (target?.tagName as string);
			valid = targetTag.toLowerCase() !== blockedElement.toLowerCase() && valid;
		}
		return valid
	}

	return setPointerControls(
		gestureName,
		node,
		onMove,
		onDown,
		onUp,
		parameters.touchAction
	);
}


// For components to animate in, we want them to override the transition style set by swipe
// So, here is a customised fly animation

export function customFly(node: Element, {
	delay = 0,
	duration = 400,
	easing = cubicOut,
	x = 0,
	y = 0,
	opacity = 0
} = {}): TransitionConfig {
	const style = getComputedStyle(node);
	const target_opacity = +style.opacity;
	
	// The single change:
	// const transform = style.transform === 'none' ? '' : style.transform;
	const transform = '';

	const od = target_opacity * (1 - opacity);

	return {
		delay,
		duration,
		easing,
		css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
	};
}