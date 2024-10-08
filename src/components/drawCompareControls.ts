// @ts-nocheck
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useEffect } from "react";
import { useControl } from "react-map-gl";

import type { MapRef, ControlPosition } from "react-map-gl";

type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
	position?: ControlPosition;
	setRef?: any;
	onCreate?: (evt: { features: object[] }) => void;
	onUpdate?: (evt: { features: object[]; action: string }) => void;
	onDelete?: (evt: { features: object[] }) => void;
};

export let drawRef: any | null = null;

export default function DrawControl(props: DrawControlProps) {
	props.setRef(
		useControl<MapboxDraw>(
			() => new MapboxDraw(props),
			({ map }: { map: MapRef }) => {
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
		),
	);

	return null;
}
