// @ts-nocheck
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useControl } from "react-map-gl";

import type { MapRef, ControlPosition } from "react-map-gl";

type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
	position?: ControlPosition;

	onCreate?: (evt: { features: object[] }) => void;
	onUpdate?: (evt: { features: object[]; action: string }) => void;
	onDelete?: (evt: { features: object[] }) => void;
};

export let drawRef: CustomDrawControl | null = null;

export default function DrawControl(props: DrawControlProps) {
	drawRef = useControl<CustomDrawControl>(
		() => new CustomDrawControl(props),
		({ map }: { map: MapRef }) => {
			console.log(map);
			map.on("draw.create", props.onCreate);
			map.on("draw.update", props.onUpdate);
			map.on("draw.delete", props.onDelete);
		},
		({ map }: { map: MapRef }) => {
			map.off("draw.create", props.onCreate);
			map.off("draw.update", props.onUpdate);
			map.off("draw.delete", props.onDelete);
		},
		{
			position: props.position,
		},
	);

	return null;
}
// function getDefaultExportFromCjs(x) {
// 	// biome-ignore lint/complexity/useOptionalChain: <explanation>
// 	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default")
// 		? x.default
// 		: x;
// }
// function extend() {
// 	const arguments$1 = arguments;

// 	let target = {};

// 	for (let i = 0; i < arguments.length; i++) {
// 		let source = arguments$1[i];

// 		for (var key in source) {
// 			if (hasOwnProperty$1.call(source, key)) {
// 				target[key] = source[key];
// 			}
// 		}
// 	}

// 	return target;
// }

// const xtend = /*@__PURE__*/ getDefaultExportFromCjs(extend);
export class CustomDrawControl extends MapboxDraw {}
