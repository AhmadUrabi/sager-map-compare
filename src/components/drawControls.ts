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

export let drawRef: MapboxDraw | null = null;

export default function DrawControl(props: DrawControlProps) {
	drawRef = useControl<MapboxDraw>(
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

export class CustomDrawControl extends MapboxDraw {
	constructor(props: DrawControlProps) {
		console.log("test");
		super(props);
	}
	onAdd(map) {
		this.map = map;
		this.container = document.createElement("div");
		this.container.className = "mapboxgl-ctrl-group mapboxgl-ctrl";
		this.button = document.createElement("button");
		this.button.className = "mapbox-gl-draw_ctrl-draw-btn";
		this.button.addEventListener("click", this.onClick.bind(this));
		this.container.appendChild(this.button);
		console.log(this.button);
		return this.container;
	}

	onClick(e) {
		// Handle button click here
	}
}
